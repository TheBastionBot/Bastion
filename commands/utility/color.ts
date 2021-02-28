/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as colors from "../../utils/colors";
import * as errors from "../../utils/errors";

export = class ColorCommand extends Command {
    constructor() {
        super("color", {
            description: "It allows you the convert the specified color in one format into many differt formats.",
            triggers: [ "colour" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "color HEX",
                "color R G B",
                "color C M Y K",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const color = colors.parse(argv._.join(" "));

        // command syntax validation
        if (!color) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // acknowledge
        await message.channel.send({
            embed: {
                color: color.integer,
                title: "Color",
                fields: [
                    {
                        name: "RGB",
                        value: color.rgb.join(", "),
                        inline: true,
                    },
                    {
                        name: "CMYK",
                        value: color.cmyk.join(", "),
                        inline: true,
                    },
                    {
                        name: "HEX",
                        value: "#" + color.hex,
                        inline: true,
                    },
                    {
                        name: "Integer",
                        value: color.integer,
                        inline: true,
                    },
                ],
            },
        });
    }
}
