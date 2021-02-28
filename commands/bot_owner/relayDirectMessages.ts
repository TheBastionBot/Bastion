/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import ConfigModel from "../../models/Config";
import BastionGuild = require("../../structures/Guild");

export = class RelayDirectMessages extends Command {
    constructor() {
        super("relayDirectMessages", {
            description: "It allows you to toggle Bastion's Direct Message Relay. If enabled, Bastion will relay all direct messages to the bot owners.",
            triggers: [ "relayDMs" ],
            arguments: {},
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const config = await ConfigModel.findById(this.client.user.id);

        // toggle direct message relay
        config.relayDirectMessages = config.relayDirectMessages ? undefined : true;

        await config.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: config.relayDirectMessages ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                title: "Direct Messages Relay",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", config.relayDirectMessages ? "directMessagesRelayEnable" : "directMessagesRelayDisable", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
