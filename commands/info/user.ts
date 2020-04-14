/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { GuildMember, Message, User } from "discord.js";

export = class UserCommand extends Command {
    constructor() {
        super("user", {
            description: "It allows you see the information of a user.",
            triggers: [ "member" ],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "user",
                "user -- USER_ID",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const identifier: string = argv._.join(" ");

        let user: User, member: GuildMember | void;

        // identify the user
        if (identifier) {
            user = await this.client.users.fetch(identifier);
            member = await message.guild.members.fetch(identifier).catch(() => {
                // this error can be ignored
            });
        } else {
            user = message.author;
            member = message.member;
        }


        // acknowledge
        message.channel.send({
            embed: {
                color: member && member.displayColor ? member.displayColor : Constants.COLORS.IRIS,
                author: {
                    name: user.tag + (member && member.nickname ? " • " + member.nickname : ""),
                },
                title: user.bot ? "Bot" : "Human",
                fields: [
                    {
                        name: "Joined Discord",
                        value: user.createdAt.toUTCString(),
                        inline: true,
                    },
                    {
                        name: "Joined Server",
                        value: member ? member.joinedAt.toUTCString() : "-",
                        inline: true,
                    },
                    {
                        name: "Boosting Since",
                        value: member && member.premiumSince ? member.premiumSince.toUTCString() : "-",
                        inline: true,
                    },
                    {
                        name: "Roles",
                        value: member && member.roles.cache.size ? [ ...member.roles.cache.values() ].slice(0, member.roles.cache.size - 1).map(r => r.name).join(", ") : "-",
                    },
                ],
                thumbnail: {
                    url: user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                footer: {
                    text: (member && member.guild.ownerID === user.id ? "Server Owner • " : "") + user.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
