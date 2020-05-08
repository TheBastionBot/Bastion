/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message, TextChannel } from "discord.js";

import * as constants from "../../utils/constants";

export = class InviteCommand extends Command {
    constructor() {
        super("invite", {
            description: "It allows you to generate an instant invite for the server. Optionally, the invite can be a temporary which will kick the members from the server if they aren't assigned a role within 24 hours. It also shows you the invite link to invite Bastion to your server.",
            triggers: [],
            arguments: {
                alias: {
                    temporary: [ "t" ],
                },
                boolean: [ "temporary" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "invite",
                "invite --temporary",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const channel = (message.guild.widgetChannel || message.channel) as TextChannel;

        // check whether member has permission to create instant invites
        if (!channel.permissionsFor(message.member).has("CREATE_INSTANT_INVITE")) throw new Error("NO_PERMISSION");

        const invite = await channel.createInvite({
            reason: "Requested by " + message.author.tag,
            temporary: argv.temporary,
        });

        // acknowledge
        await message.channel.send(
            "Hello. Beep. Boop.\nIf you wanna invite friends to this server, share the following invite link with your friends.\nBeep!\n" + invite.url
            + ((constants.isPublicBastion(this.client.user) || this.client.credentials.owners.includes(message.author.id)) ? "\n\nAnd if you wanna invite me to your server, use the following link.\nBeep.\n" + this.client.locale.getConstant("bastion.bot.invite").replace(this.client.locale.getConstant("bastion.bot.id"), this.client.user.id) : "")
        );
    }
}
