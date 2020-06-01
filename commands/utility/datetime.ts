/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

export = class DateTimeCommand extends Command {
    constructor() {
        super("datetime", {
            description: "It allows you to see the current time in multiple different time zones. It also allows you to convert the specified time into multiple different time zones.",
            triggers: [ "date", "time", "now" ],
            arguments: {
                alias: {
                    convert: [ "c" ],
                },
                array: [ "convert" ],
                string: [ "convert" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "datetime",
                "datetime TIMEZONE...",
                "datetime --convert DATE",
                "datetime --convert DATE -- TIMEZONE...",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const timezones: string[] = argv._;

        const dates: string[] = [];

        if (timezones.length) {
            for (const timezone of timezones) {
                try {
                    dates.push(new Date(argv.convert ? argv.convert.join(" ") : Date.now()).toLocaleString("en-US", { timeZone: timezone, timeZoneName: "long" }));
                } catch {
                    // this error can be ignored
                }
            }
        } else {
            dates.push(new Date(argv.convert ? argv.convert.join(" ") : Date.now()).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "long" }));
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Date and Time",
                description: dates.join("\n"),
            },
        });
    }
}
