/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");


export = class ReactionPinningCommand extends Command {
    constructor() {
        super("reactionPinning", {
            description: "It allows you to enable (and disable) Reaction Pinning in the server. If enabled, when someone with proper permission adds a Pin reaction to a message, the message gets pinned in the channel.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the announcement channel
        if (guild.document.reactionPinning) {
            guild.document.reactionPinning = undefined;
            delete guild.document.reactionPinning;
        } else {
            guild.document.reactionPinning = true;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.reactionPinning ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString("en_us", "info", guild.document.reactionPinning ? "reactionPinningEnable" : "reactionPinningDisable", message.author.tag),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
