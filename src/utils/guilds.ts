/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed, Guild } from "discord.js";
import { Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import { COLORS } from "./constants";

/**
 * Log guild event in the guild's log channel.
 * @param guild The discord.js Guild object.
 * @param data The embed data for the log message.
 */
export const logGuildEvent = async (guild: Guild, data: APIEmbed) => {
    // get the guild document
    const guildDocument = await GuildModel.findById(guild instanceof Guild ? guild.id : "");

    // get the log channel
    const logChannel = guild.channels.cache.get(guildDocument?.serverLogChannel);

    // check whether it's a text based channel
    if (logChannel?.isTextBased()) {
        logChannel.send({
            embeds: [
                {
                    color: COLORS.YELLOW,
                    ...data,
                },
            ],
        }).catch(Logger.ignore);
    }
};

/**
 * Log moderation event in the guild's log channel.
 * @param guild The discord.js Guild object.
 * @param data The embed data for the log message.
 */
export const logModerationEvent = async (guild: Guild, data: APIEmbed) => {
    // get the guild document
    const guildDocument = await GuildModel.findById(guild instanceof Guild ? guild.id : "");

    // get the log channel
    const logChannel = guild.channels.cache.get(guildDocument?.moderationLogChannel);

    // check whether it's a text based channel
    if (logChannel?.isTextBased()) {
        logChannel.send({
            embeds: [
                {
                    color: COLORS.ORANGE,
                    ...data,
                },
            ],
        }).catch(Logger.ignore);
    }
};
