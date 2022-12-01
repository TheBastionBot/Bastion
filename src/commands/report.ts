/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, GuildTextBasedChannel } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import MessageComponents from "../utils/components";
import { COLORS } from "../utils/constants";

class ReportCommand extends Command {
    constructor() {
        super({
            name: "report",
            description: "Report a server member to the moderators of the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user you want to report.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason you want to report the user.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // send the report
        if (guildDocument?.reportsChannel && interaction.guild.channels.cache.has(guildDocument.reportsChannel)) {
            await (interaction.guild.channels.cache.get(guildDocument.reportsChannel) as GuildTextBasedChannel).send({
                embeds: [
                    {
                        color: COLORS.ORANGE,
                        author: {
                            name: interaction.user.tag + " / " + interaction.user.id,
                        },
                        title: "User Report",
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
                        ],
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Timeout",
                                style: ButtonStyle.Secondary,
                                customId: MessageComponents.UserReportTimeoutButton,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Kick",
                                style: ButtonStyle.Danger,
                                customId: MessageComponents.UserReportKickButton,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Ban",
                                style: ButtonStyle.Danger,
                                customId: MessageComponents.UserReportBanButton,
                            },
                        ],
                    },
                ],
            });

            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "reportReceived"));
        }

        return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "reportNotConfigured"));
    }
}

export = ReportCommand;
