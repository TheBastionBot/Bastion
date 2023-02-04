/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, GuildTextBasedChannel } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import MessageComponents from "../utils/components.js";
import { COLORS } from "../utils/constants.js";

class SuggestCommand extends Command {
    constructor() {
        super({
            name: "suggest",
            description: "Send a suggestion to the server staff.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "suggestion",
                    description: "What do you want to suggest?",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });
        const suggestion = interaction.options.getString("suggestion");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // send the suggestion
        if (guildDocument?.suggestionsChannel && interaction.guild.channels.cache.has(guildDocument.suggestionsChannel)) {
            const message = await (interaction.guild.channels.cache.get(guildDocument.suggestionsChannel) as GuildTextBasedChannel).send({
                embeds: [
                    {
                        color: COLORS.INDIGO,
                        author: {
                            name: interaction.user.tag + " / " + interaction.user.id,
                        },
                        title: "Suggestion",
                        description: suggestion,
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Accept",
                                style: ButtonStyle.Success,
                                customId: MessageComponents.SuggestionAcceptButton,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Reject",
                                style: ButtonStyle.Danger,
                                customId: MessageComponents.SuggestionRejectButton,
                            },
                        ],
                    },
                ],
            });

            // set the message up for voting
            message.react("👍").catch(Logger.ignore);
            message.react("👎").catch(Logger.ignore);

            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "suggestionReceived"));
        }

        return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "suggestionNotConfigured"));
    }
}

export { SuggestCommand as Command };
