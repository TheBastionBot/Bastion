/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import confirmation from "../../utils/confirmation";

export = class LeaveCommand extends Command {
    constructor() {
        super("leave", {
            description: "It allows you to ask Bastion to leave the server and clear all data it has on server and its members.",
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
        const answer = await confirmation(message, "**Are you sure you want me to leave the server?** I'll have to remove all the data I have on this server and all the configurations that you've done to me. I won't recognize you the next time you invite me here.");

        // acknowledge
        await message.channel.send({
            embed: {
                color: answer ? Constants.COLORS.RED : Constants.COLORS.IRIS,
                description: answer
                    ? "I will miss each and everyone of you here. May we meet again.\nIf you think I can improve in some way, please [let my team know](" + this.client.locale.getConstant("bastion.server.invite") + ").\n\n*sad robot noises*"
                    : "I knew it in my heart that you won't let me leave. 💙",
            },
        }).catch(() => {
            // this error can be ignored
        });

        if (answer) {
            // meme
            await message.channel.send("*has left the chat.*").catch(() => {
                // this error can be ignored
            });

            // leave the guild
            await message.guild.leave();
        }
    }
}
