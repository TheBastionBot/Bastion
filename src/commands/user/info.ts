/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import { COLORS } from "../../utils/constants.js";
import { resolveStatus } from "../../utils/members.js";

class UserInfoCommand extends Command {
    constructor() {
        super({
            name: "info",
            description: "Displays information on the specified user.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose information you want to display.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = interaction.options.getUser("user") ? await interaction.guild.members.fetch(user).catch(Logger.ignore) : interaction.member;

        await interaction.reply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: user.tag + (member && member.nickname ? " / " + member.nickname : ""),
                    },
                    title: user.bot ? "Bot" : "Human",
                    fields: [
                        {
                            name: "Status",
                            value: member && member.presence?.status ? resolveStatus(member.presence.status) : "-",
                            inline: true,
                        },
                        {
                            name: "Timeout",
                            value: member && member.communicationDisabledUntilTimestamp ? `Over <t:${ (member.communicationDisabledUntilTimestamp / 1000).toFixed() }:R>` : "No timeout",
                            inline: true,
                        },
                        {
                            name: "Boosting Since",
                            value: member && member.premiumSince ? `<t:${ Math.round(member.premiumSinceTimestamp / 1000) }>` : "-",
                            inline: true,
                        },
                        {
                            name: "Joined Discord",
                            value: `<t:${ Math.round(user.createdTimestamp / 1000) }>`,
                            inline: true,
                        },
                        {
                            name: "Joined Server",
                            value: member ? `<t:${ Math.round(member.joinedTimestamp / 1000) }>` : "-",
                            inline: true,
                        },
                        {
                            name: "Voice Channel",
                            value: member && member.voice?.channel ? member.voice.channel.toString() : "-",
                            inline: true,
                        },
                        {
                            name: "Roles",
                            value: member && member.roles.cache.size > 1 ? [ ...member.roles.cache.values() ].slice(0, member.roles.cache.size - 1).map(r => r.name).join(", ") : "-",
                        },
                    ],
                    thumbnail: {
                        url: user.displayAvatarURL({ size: 512 }),
                    },
                    footer: {
                        text: (member && member.guild.ownerId === user.id ? "Server Owner • " : "") + user.id,
                    },
                },
            ],
        });
    }
}

export { UserInfoCommand as Command };
