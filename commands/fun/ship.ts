/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import TesseractClient from "@bastion/tesseract/typings/client/TesseractClient";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as strings from "../../utils/strings";

export = class ShipCommand extends Command {
    constructor() {
        super("ship", {
            description: "It allows you to ship two people and see their compatiblity.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "ship USER USER",
            ],
        });
    }

    private shortString = (data: string): string => {
        let result = "";

        if (data.length >= 2) {
            result = (Number.parseInt(data[0]) + Number.parseInt(data[data.length - 1])).toString() + this.shortString(data.substring(1, data.length - 1));
        } else {
            return data;
        }

        return result;
    }

    private calculate = (data: string): string => {
        let output = data;

        while (output.length > 2) {
            output = this.shortString(output);
        }

        return output + "%";
    }

    exec = async (message: Message, args: CommandArguments): Promise<void> => {
        // command syntax validation
        if (args._.length < 2) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const firstUser = message.mentions.members.size ? message.mentions.members.first() : (message.client as TesseractClient).resolver.resolveGuildMember(message.guild, args._[0]);
        const secondUser = message.mentions.members.size > 1 ? message.mentions.members.find(m => m.id !== firstUser.id) : (message.client as TesseractClient).resolver.resolveGuildMember(message.guild, args._[1]);

        const firstName = firstUser ? firstUser.displayName : args._[0];
        const secondName = secondUser ? secondUser.displayName : args._[1];

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: firstName + " ❤️ " + secondName,
                description: "**" + firstName + "** and **" + secondName + "** are **" + this.calculate(Object.values(strings.frequency(firstName.toString().toLowerCase() + " loves " + secondName.toString().toLowerCase())).join("")) + "** compatible with each other.",
            },
        });
    }
}
