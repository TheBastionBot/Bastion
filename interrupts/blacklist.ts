/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Interrupt } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import ConfigModel from "../models/Config";


export = class Blacklist extends Interrupt {
    constructor() {
        super("blacklist", {
            type: 0,
        });
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!(message.channel instanceof TextChannel)) return;

        if (!message.content || !message.content.length) return false;

        // get config document
        const config = await ConfigModel.findById(this.client.user.id);

        // check whether the guild is blacklisted
        if (config.blacklistedGuildIds && config.blacklistedGuildIds.includes(message.guild.id)) return true;

        // check whether the user is blacklisted
        if (config.blacklistedUserIds && config.blacklistedUserIds.includes(message.author.id)) return true;

        return false;
    }
}
