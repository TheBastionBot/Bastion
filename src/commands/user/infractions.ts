/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import MemberModel from "../../models/Member.js";
import { COLORS } from "../../utils/constants.js";

class UserInfractionsCommand extends Command {
    constructor() {
        super({
            name: "infractions",
            description: "Configure infraction actions and displays infractions of the specified user.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timeout",
                    description: "Number of violations after which the user is timed out.",
                    min_value: 1,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "kick",
                    description: "Number of violations after which the user is kicked.",
                    min_value: 1,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "ban",
                    description: "Number of violations after which the user is banned.",
                    min_value: 1,
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose infractions you want to display.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "remove",
                    description: "The infraction you want to remove from the user.",
                    min_value: 1,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ModerateMembers ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const timeoutThreshold = interaction.options.getInteger("timeout");
        const kickThreshold = interaction.options.getInteger("kick");
        const banThreshold = interaction.options.getInteger("ban");
        const user = interaction.options.getUser("user");
        const remove = interaction.options.getInteger("remove");

        if (user) {
            // get member
            const member = user ? await interaction.guild.members.fetch(user).catch(Logger.ignore) : undefined;
            const memberDocument = await MemberModel.findOne({ user: user.id, guild: interaction.guildId });

            if (!memberDocument?.infractions?.length) {
                return await interaction.editReply({
                    content: `${ user } has no active infractions.`,
                    allowedMentions: {
                        users: [],
                    },
                });
            }

            if (remove) {
                // remove the infraction
                const [ infraction ] = memberDocument.infractions.splice(remove - 1, 1);

                if (infraction) {
                    // save the member document
                    await memberDocument.save();

                    return await interaction.editReply(`I've removed the **${ infraction }** infraction from ${ user }.`);
                }

                return await interaction.editReply(`${ user } only has ${ memberDocument.infractions.length } active infractions.`);
            }

            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        author: {
                            name: user.tag + (member && member.nickname ? " / " + member.nickname : ""),
                        },
                        title: "Infractions",
                        fields: memberDocument.infractions.map((infraction, i) => ({
                            name: `#${ i + 1 }`,
                            value: infraction,
                        })),
                        footer: {
                            text: user.id,
                        },
                    },
                ],
            });
        }

        // get guild document
        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (interaction.channel.permissionsFor(interaction.member)?.has(PermissionFlagsBits.ManageGuild)) {
            guildDocument.infractionsTimeoutThreshold = timeoutThreshold;
            guildDocument.infractionsKickThreshold = kickThreshold;
            guildDocument.infractionsBanThreshold = banThreshold;

            await guildDocument.save();

            return await interaction.editReply(`**Timeout**, **Kick** and **Ban** thresholds have been set to **${ timeoutThreshold || 0 }**, **${ kickThreshold || 0 }** and **${ banThreshold || 0 }** warnings, respectively.`);
        }

        return await interaction.editReply(`**Timeout**, **Kick** and **Ban** thresholds are set to **${ guildDocument.infractionsTimeoutThreshold || 0 }**, **${ guildDocument.infractionsKickThreshold || 0 }** and **${ guildDocument.infractionsBanThreshold || 0 }** warnings, respectively.`);
    }
}

export { UserInfractionsCommand as Command };
