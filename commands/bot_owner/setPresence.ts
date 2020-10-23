/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, Presence } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class SetPresence extends Command {
    constructor() {
        super("setPresence", {
            description: "It allows you to update Bastion's presence in the shard.",
            triggers: [ "setActivity" ],
            arguments: {
                array: [ "game" ],
                string: [ "game", "status", "type" ],
                coerce: {
                    url: Constants.ArgumentTypes.URL,
                },
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "setPresence --status STATUS",
                "setPresence --game GAME --type TYPE --url TWITCH_URL",
            ],
        });
    }

    getStatusIndicator = (presence: Presence): string => {
        switch (presence.status) {
        case "online":
            return ":green_circle:";
        case "idle":
            return ":yellow_circle:";
        case "dnd":
            return ":red_circle:";
        case "offline":
            return ":black_circle:";
        }
    }

    isValidTwitchURL = (url: string): boolean => url && url.startsWith("https://twitch.tv/");

    isValidType = (type: string): boolean => type && [ "PLAYING", "WATCHING", "LISTENING", "STREAMING", "COMPETING" ].includes(type.toUpperCase());

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // set presence
        const activity = argv.game ? {
            name: argv.game.join(" "),
            type: this.isValidType(argv.type) ? argv.type.toUpperCase() : undefined,
            url: this.isValidTwitchURL(argv.url && argv.url.href) ? argv.url : undefined,
        } : undefined;

        const presence: Presence = await this.client.user.setPresence({
            activity,
            status: argv.status,
        });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                title: "Presence Updated",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "setPresence", message.author.tag),
                fields: [
                    {
                        name: "Status",
                        value: this.getStatusIndicator(presence) + " " + presence.status.toUpperCase(),
                        inline: true,
                    },
                    {
                        name: "Activity",
                        value: presence.activities.length
                            ? presence.activities[0].type + " " + presence.activities[0].name
                            : "-",
                        inline: true,
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
