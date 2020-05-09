/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

export = class DateTimeCommand extends Command {
    constructor() {
        super("datetime", {
            description: "It allows you to see the current time, optionally in the specified time zone.",
            triggers: [ "date", "time", "now" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "datetime",
                "datetime TIMEZOME",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const timezone: string = argv._.join(" ");

        let date: string;

        // validate timezone
        try {
            date = new Date().toLocaleString("en-US", { timeZone: timezone ? timezone : "UTC", timeZoneName: "long" });
        } catch {
            throw new Error("INVALID_TIMEZONE");
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: date,
            },
            footer: {
                text: "Date and Time",
            },
        });
    }
}
