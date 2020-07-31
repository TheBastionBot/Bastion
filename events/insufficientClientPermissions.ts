/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants, ModuleManagerEvent } from "@bastion/tesseract";
import { Message } from "discord.js";

export = class InsufficientClientPermissionsEvent extends ModuleManagerEvent {
    constructor() {
        super("insufficientClientPermissions");
    }

    exec = async (command: Command, message: Message): Promise<unknown> => {
        return message.channel.send({
            embed: {
                color: Constants.COLORS.RED,
                title: "Insufficient Permissions",
                description: "I don't have the requried permissions in this channel to execute this command.",
                footer: {
                    text: "Use the `" + command.name + " --help` command to get more information on the command.",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
