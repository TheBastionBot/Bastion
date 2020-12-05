/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import GuildModel from "../../models/Guild";
import MemberModel from "../../models/Member";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class BoostCommand extends Command {
    constructor() {
        super("boost", {
            description: "It allows you to boost the server in Bastion's server listings. You can boost the server once every 24 hours. Server's boost score gets reset every month.",
            triggers: [ "bump" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // get the member document
        const memberDocument = await MemberModel.findOne({
            user: message.author.id,
            guild: message.guild.id,
        });

        const today = new Date();
        const lastBoosted = new Date(memberDocument.boost);

        // check whether already boosted today
        if (today.toDateString() === lastBoosted.toDateString()) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "alreadyBoosted", message.author.tag));
        // otherwise, update last boost date to today
        memberDocument.boost = today.getTime();


        // get the guild document
        const guildDocument = await GuildModel.findById(message.guild.id);
        if (guildDocument.boosts) guildDocument.boosts += 1;
        else guildDocument.boosts = 1;


        // save documents
        await guildDocument.save();
        await memberDocument.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: message.guild.name,
                    url: this.client.locale.getConstant("bastion.website") + "/servers/" + message.guild.id,
                },
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "boost", message.author.tag),
            },
        });
    }
}
