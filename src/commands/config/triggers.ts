/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import TriggerModel from "../../models/Trigger";
import { COLORS, isPublicBastion } from "../../utils/constants";
import { parseEmoji } from "../../utils/emojis";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium";

class TriggersCommand extends Command {
    constructor() {
        super({
            name: "triggers",
            description: "Configure triggers and responses in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "add",
                    description: "The pattern that will trigger the response.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "remove",
                    description: "The trigger that you want to remove.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The message response for the trigger.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "emoji",
                    description: "The reaction emoji response for the trigger.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const add = interaction.options.getString("add");
        const remove = interaction.options.getString("remove");
        const message = interaction.options.getString("message");
        const emoji = parseEmoji(interaction.options.getString("emoji"));

        // remove trigger
        if (remove) {
            // delete all the trigger matching the specified pattern
            await TriggerModel.deleteMany({
                guild: interaction.guildId,
                pattern: remove,
            });

            return interaction.editReply(`I've deleted the triggers matching **${ remove }**.`);
        }

        // add trigger
        if (add && (message || emoji)) {
            // check for limits
            if (isPublicBastion(interaction.client.user.id)) {
                const tier = await getPremiumTier(interaction.guild.ownerId);
                const triggerCount = await TriggerModel.countDocuments({
                    guild: interaction.guildId,
                });

                const limit = checkFeature(tier, Feature.Triggers) as number;
                if (triggerCount >= limit) {
                    return interaction.editReply(`You need to upgrade from Bastion ${ tier } to add more than ${ limit } triggers.`);
                }
            }

            // create a new trigger
            await TriggerModel.create({
                guild: interaction.guildId,
                pattern: add,
                message: message,
                reactions: emoji,
            });

            return interaction.editReply(`I've add the trigger **${ add }**.`);
        }

        // get all the triggers
        const triggers = await TriggerModel.find({ guild: interaction.guild.id });

        if (triggers?.length) {
            return interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        fields: triggers.map(t => ({
                            name: t.pattern,
                            value: t.message && t.reactions ? "Message & Reaction Responses" : t.message ? "Message Response" : "Reaction Response",
                        })),
                    },
                ],
            });
        }

        return interaction.editReply("There are no triggers in this server.");
    }
}

export = TriggersCommand;
