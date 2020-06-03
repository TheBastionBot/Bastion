/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client, Constants } from "@bastion/tesseract";
import { EmbedFieldData, Guild, Message, NewsChannel, TextChannel, VoiceChannel, Snowflake } from "discord.js";
import * as mongoose from "mongoose";

import GuildModel, { Guild as IGuild } from "../models/Guild";
import CaseModel from "../models/Case";


interface GuildMusic {
    id: string;
    track: string;
    album: string;
    artist: string;
    duration: string;
    thumbnail: string;
    requester: Snowflake;
}

interface GuildCreateLogOptions {
    event: string;
    fields: EmbedFieldData[];
    footer?: string;
    timestamp?: number | Date;
}

interface GuildCreateModerationLogOptions {
    event: string;
    fields: EmbedFieldData[];
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
                        color: Constants.COLORS.SOMEWHAT_DARK,
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

    public async createModerationLog(options: GuildCreateModerationLogOptions): Promise<void> {
        const document = await this.getDocument();

        const channelsPool = this.client.channels.cache.filter(c => c.type === "text" || c.type === "news");

        if (document.moderationLogChannelId && channelsPool.has(document.moderationLogChannelId)) {
            const moderationLogChannel = channelsPool.get(document.moderationLogChannelId);

            if (moderationLogChannel instanceof NewsChannel || moderationLogChannel instanceof TextChannel) {
                // increment moderation case count
                document.moderationCaseCount = document.moderationCaseCount ? document.moderationCaseCount + 1 : 1;

                // create moderation log message
                const moderationLogMessage = await moderationLogChannel.send({
                    embed: {
                        color: Constants.COLORS.ORANGE,
                        title: this.client.locale.getString(document.language, "events", options.event),
                        fields: options.fields,
                        footer: {
                            text: "Case #" + document.moderationCaseCount,
                        },
                        timestamp: new Date(),
                    },
                });

                // create moderation case log
                await CaseModel.create({
                    guild: this.id,
                    number: document.moderationCaseCount,
                    messageId: moderationLogMessage.id,
                });

                // save guild document
                await document.save();
            }
        }
    }
}
