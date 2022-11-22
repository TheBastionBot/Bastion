/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { Command } from "@bastion/tesseract";

class JoinCommand extends Command {
    constructor() {
        super({
            name: "join",
            description: "Moves you to the voice channel where Bastion is currently connected.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        // check whether the user is already connected to a voice channel
        if (!interaction.member.voice?.channelId) {
            return await interaction.reply({
                content: "You need to be connected to a voice channel before I can move you to other channels.",
                ephemeral: true,
            });
        }

        // check whether bastion is already connected to a voice channel
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            return await interaction.reply({
                content: "I'm not connected to any voice channels in the server.",
                ephemeral: true,
            });
        }

        // check whether member has permission to join the voice channel
        const voiceChannel = interaction.guild.channels.cache.get(connection.joinConfig.channelId);
        if (voiceChannel?.permissionsFor(interaction.member)?.has(PermissionFlagsBits.Connect)) {
            await interaction.member.voice.setChannel(connection.joinConfig.channelId);
            return await interaction.reply(`I've moved you to the **${ voiceChannel.name }** voice channel.`);
        }

        return await interaction.reply(`You don't have the permission to join the ${ voiceChannel?.permissionsFor(interaction.member)?.has(PermissionFlagsBits.ViewChannel) ? `**${ voiceChannel.name }**` : "" } voice channel.`);
    }
}

export = JoinCommand;
