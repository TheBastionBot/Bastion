/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import TesseractClient from "@bastion/tesseract/typings/client/TesseractClient";
import { Message } from "discord.js";

import * as strings from "../../utils/strings";

export = class SimpnessCommand extends Command {
    constructor() {
        super("simpness", {
            description: "It allows you to see how much of a simp someone is on any given day.",
            triggers: [ "simp" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "simpness",
                "simpness USER",
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
        const user = message.mentions.members.size ? message.mentions.members.first() : ((message.client as TesseractClient).resolver.resolveGuildMember(message.guild, args._.join(" ")) || message.member);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: "According to my calculations, **" + user.displayName + "**, you are **" + (user.id === "266290969974931457" ? "0%" : this.calculate(Object.values(strings.frequency(user.displayName.toLowerCase() + " " + new Date().toDateString())).join(""))) + "** simp today.",
            },
        });
    }
}
