/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { Constants, EmbedFieldData, Guild, Message, NewsChannel, TextChannel, VoiceChannel } from "discord.js";
import * as mongoose from "mongoose";

import GuildModel, { Guild as IGuild } from "../models/Guild";


interface GuildMusic {
    id: string;
    track: string;
    album: string;
    artist: string;
    duration: string;
    thumbnail: string;
}

interface GuildCreateLogOptions {
    event: string;
    fields: EmbedFieldData[];
    footer?: string;
    timestamp?: number | Date;
}

export = class BastionGuild extends Guild {
    client: Client;
    document: IGuild & mongoose.Document;
    music: {
        queue: GuildMusic[];
        history: GuildMusic[];
        playing: boolean;
        repeat: boolean;
        skipVotes: string[];
        textChannel?: NewsChannel | TextChannel;
        voiceChannel?: VoiceChannel;
    };

    constructor(client: Client, data: object) {
        super(client, data);

        this.music = {
            queue: [],
            history: [],
            playing: false,
            repeat: false,
            skipVotes: [],
        };
    }

    public async getDocument(): Promise<IGuild & mongoose.Document> {
        return await GuildModel.findById(this.id);
    }

    public async createLog(options: GuildCreateLogOptions): Promise<Message> {
        const document = await this.getDocument();

        const channelsPool = this.client.channels.cache.filter(c => c.type === "text" || c.type === "news");

        if (document.serverLogChannelId && channelsPool.has(document.serverLogChannelId)) {
            const serverLogChannel = channelsPool.get(document.serverLogChannelId);

            if (serverLogChannel instanceof NewsChannel || serverLogChannel instanceof TextChannel) {
                return serverLogChannel.send({
                    embed: {
                        color: Constants.Colors.DARK_BUT_NOT_BLACK,
                        title: this.client.locale.getString(document.language, "events", options.event),
                        fields: options.fields,
                        footer: {
                            text: options.footer,
                        },
                        timestamp: options.timestamp || new Date(),
                    },
                });
            }
        }
    }
}
