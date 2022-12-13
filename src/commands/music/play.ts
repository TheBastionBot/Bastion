/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, entersState, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Client, Command, Logger } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";
import * as playDL from "play-dl";
import ytpl from "ytpl";

import GuildModel from "../../models/Guild";
import { isPublicBastion } from "../../utils/constants";
import { isPremiumUser } from "../../utils/premium";

class PlayCommand extends Command {
    constructor() {
        super({
            name: "play",
            description: "Play a specified song in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "song",
                    description: "The song name or link you want to play.",
                    required: true,
                },
            ],
        });
    }

    /**
     * Join specified voice channel and create new voice connection.
     */
    private createVoiceConnection = (interaction: ChatInputCommandInteraction<"cached">): VoiceConnection => {
        // join voice channel and create new voice connection
        const connection = joinVoiceChannel({
            selfDeaf: true,
            selfMute: false,
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // voice connection events
        connection.on("error", Logger.error);
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                // seems to be reconnecting to a new channel, ignore disconnect
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                // seems to be a real disconnect which SHOULDN'T be recovered from
                connection.destroy();

                const studio = (interaction.client as Client).studio.get(interaction.guild);
                if (studio) {
                    // stop audio player
                    studio.player?.stop();
                    // delete studio from studio manager
                    (interaction.client as Client).studio.delete(interaction.guild);
                }
            }
        });

        return connection;
    };

    /**
     * Event handler for AudioPlayerStatus.Idle event. Plays the next item in queue
     * or stops the player.
     */
    private IdleStateHandler = async (interaction: ChatInputCommandInteraction<"cached">) => {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        // get next song in queue
        const song = studio.queue.shift();
        if (song) {
            // create the audio resource
            const resource = await this.createAudioResource(song).catch(Logger.error);
            if (resource) {
                // play the resource
                studio.player.play(resource);
                await interaction.channel.send(`Now playing **${ song.name }**.`);
            } else {
                await interaction.channel.send(`I couldn't play **${ song.name }**.`);
            }
        } else {
            // stop audio player
            studio.player.stop();
            // delete studio from studio manager
            (interaction.client as Client).studio.delete(interaction.guild);
            // destroy voice connection
            getVoiceConnection(interaction.guildId).destroy();
        }
    };

    /**
     * Create new music studio for the server.
     */
    private createMusicStudio = (interaction: ChatInputCommandInteraction<"cached">): music.Studio => {
        // create audio player
        const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

        // add the studio to bastion's studio manager
        const studio: music.Studio = { player, queue: [] };
        (interaction.client as Client).studio.set(interaction.guild, studio);

        // audio player events
        player.on("error", Logger.error);
        player.on(AudioPlayerStatus.Idle, () => this.IdleStateHandler(interaction));

        return studio;
    };

    /**
     * Create a audio resource for the specified audio.
     */
    private createAudioResource = async (audio: music.Song): Promise<AudioResource<music.Song>> => {
        const source = await playDL.stream(audio.url, { quality: 2 });
        return createAudioResource(source.stream, { inputType: source.type, metadata: audio });
    };

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const song = interaction.options.getString("song");

        // get the guild document
        const guildDocument = await GuildModel.findById(interaction.guildId);

        // check whether music is enabled in the guild
        if (!guildDocument.music) {
            return interaction.editReply("Music is not enabled in the server.");
        }

        // check for premium membership
        if (isPublicBastion(interaction.client.user.id)) {
            if (!await isPremiumUser(interaction.guild.ownerId)) {
                return interaction.editReply("Music is only enabled in Premium Servers in the Public Bastion.");
            }
        }

        // get existing music studio or create a new one
        const studio = (interaction.client as Client).studio.has(interaction.guild) ? (interaction.client as Client).studio.get(interaction.guild) : this.createMusicStudio(interaction);

        // get existing voice connection
        const existingConnection = getVoiceConnection(interaction.guildId);

        // check if the channel is voice based
        if (!existingConnection && !interaction.channel.isVoiceBased()) {
            return interaction.editReply("Music commands can only be used in voice channels.");
        }

        // get existing voice connection or create a new one
        const connection = existingConnection || this.createVoiceConnection(interaction);

        // subscribe to the audio player
        const subscription = connection.subscribe(studio.player);

        if (!subscription) return await interaction.editReply("I couldn't connect to the voice channel.");

        // check whether a YouTube plalist link is provided
        if (ytpl.validateID(song)) {
            // fetch the playlist data from YouTube
            const playlist = await ytpl(song);

            // cgeck whether the playlist has any items
            if (!playlist.items.length) return await interaction.editReply("This playlist doesn't have any playable items.");

            // songs in the playlist
            const queueItems = playlist.items.map(i => ({
                name: i.title,
                url: i.shortUrl,
                duration: i.durationSec,
                user: interaction.user.username,
            }));

            // if queue is full or already playing, add all songs to queue.
            if (studio.player.state.status === AudioPlayerStatus.Playing || studio.queue?.length) {
                studio.queue = studio.queue.concat(queueItems);
                return await interaction.editReply(`I've added **${ queueItems.length }** items to the queue from the **[${ playlist.title }](${ playlist.url })** playlist.`);
            }

            // remove the first song to play and add rest of the songs to queue.
            const queueItem: music.Song = queueItems.shift();
            studio.queue = studio.queue.concat(queueItems);

            // create the audio resource
            const resource = await this.createAudioResource(queueItem);

            // play the resource
            studio.player.play(resource);
            return await interaction.editReply(`Now playing **${ queueItem.name }** from the **[${ playlist.title }](${ playlist.url })** playlist.`);
        }

        // search for the song info
        const [ video ] = await playDL.search(song, {
            source: { youtube: "video" },
            limit: 1,
            language: "en-US",
        });

        // song not found
        if (!video) return await interaction.editReply(`I didn't find any results for **${ song }**.`);

        // create new queue item
        const queueItem: music.Song = {
            name: video.title || song,
            url: video.url,
            duration: video.durationInSec,
            user: interaction.user.username,
        };

        // if queue is full or already playing, add song to queue
        if (studio.player.state.status === AudioPlayerStatus.Playing || studio.queue?.length) {
            studio.queue.push(queueItem);
            return await interaction.editReply(`I've added **${ queueItem.name }** to the queue.`);
        }

        // create the audio resource
        const resource = await this.createAudioResource(queueItem);

        // play the resource
        studio.player.play(resource);
        await interaction.editReply(`Now playing **${ queueItem.name }**.`);
    }
}

export = PlayCommand;
