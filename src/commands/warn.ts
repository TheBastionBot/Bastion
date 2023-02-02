/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

import { logModerationEvent } from "../utils/guilds.js";
import { addInfraction, manageable } from "../utils/members.js";

class WarnCommand extends Command {
    constructor() {
        super({
            name: "warn",
            description: "Warn server members and add infractions to their server profile.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user you want to warn.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for the warning.",
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ModerateMembers ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const member = await interaction.guild.members.fetch(user);

        if (manageable(interaction.member, member)) {
            // add infraction to the member
            await addInfraction(member, reason);

            const warnMessage = await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "warnSuccess", { user, reason }));

            // create moderation log
            return logModerationEvent(interaction.guild, {
                title: "User Warned",
                url: warnMessage.url,
                fields: [
                    {
                        name: "User",
                        value: user.tag,
                        inline: true,
                    },
                    {
                        name: "User ID",
                        value: user.id,
                        inline: true,
                    },
                    {
                        name: "Reason",
                        value: reason,
                    },
                    {
                        name: "Moderator",
                        value: interaction.user.tag,
                        inline: true,
                    },
                ],
            }).catch(Logger.ignore);
        }

        return await interaction.editReply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, "warnPermsError", { user }),
        });
    }
}

export { WarnCommand as Command };
