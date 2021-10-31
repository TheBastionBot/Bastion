/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class KarmaCommand extends Command {
    constructor() {
        super("karma", {
            description: "It allows you to give someone the sweet little internet points, we call karma, if you think they're worth it. You can also add a personalized message along with it. You can give up to 3 karmas every 6 hours, so spend it wisely.",
            triggers: [ "rep" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 216e2,
            ratelimit: 3,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "karma USER",
                "karma USER -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // check whether the specified user is a server member
        const member = this.client.resolver.resolveGuildMember(message.guild, argv._.join(" "));
        if (!member) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "memberNotFound"));

        // check whether author is giving karma to themselves
        if (message.author.id === member.id) throw new Error("NO_SELF_KARMA");

        // get member's profile data
        const memberProfile = await MemberModel.findOne({ user: member.id, guild: message.guild.id });

        // check whether member profile exists
        if (!memberProfile) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "profileNotFound", member.user.tag));

        // give karma to the member
        memberProfile.karma += 1;

        // save the member document
        await memberProfile.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "karma", message.author.tag, member.user.tag),
                fields: argv._.length ?
                    [
                        {
                            name: "Message",
                            value: argv._.join(" "),
                        },
                    ] : [],
            },
        }).catch(() => {
            // this error can be ignored
        });
    };
}
