/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import PollModel from "../models/Poll.js";
import MessageComponents from "../utils/components.js";
import { COLORS, isPublicBastion } from "../utils/constants.js";
import { checkFeature, Feature, getPremiumTier, premiumFeatureUpsell, premiumLimitUpsell } from "../utils/premium.js";

class PollCommand extends Command {
    /** The default poll vote reactions. */
    private reactions: string[];

    constructor() {
        super({
            name: "poll",
            description: "Run polls in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "question",
                    description: "The question for the poll.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option1",
                    description: "The 1st option for the poll's answer.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option2",
                    description: "The 2nd option for the poll's answer.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option3",
                    description: "The 3rd option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option4",
                    description: "The 4th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option5",
                    description: "The 5th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option6",
                    description: "The 6th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option7",
                    description: "The 7th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option8",
                    description: "The 8th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option9",
                    description: "The 9th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option10",
                    description: "The 10th option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timer",
                    description: "Number of hours the poll should run.",
                    min_value: 1,
                    max_value: 720,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });

        this.reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const question = interaction.options.getString("question");

        const options = Array.from(Array(10)).map((_, i) => interaction.options.getString("option" + (i + 1))).filter(o => !!o?.trim());
        const timer = interaction.options.getInteger("timer");

        // check for limits
        if (timer && isPublicBastion(interaction.client.user.id)) {
            const tier = await getPremiumTier(interaction.guild.ownerId);
            const pollTimerLimit = checkFeature(tier, Feature.PollTimeout) as number;
            const timedPollsAvailable = pollTimerLimit > 0;

            if (timer > pollTimerLimit) {
                return await interaction.editReply(timedPollsAvailable
                    ? premiumLimitUpsell(interaction, "premiumLimitPollTimer", pollTimerLimit, tier)
                    : premiumFeatureUpsell(interaction, "premiumFeatureTimedPolls", tier));
            }

            // find active polls in the server
            const activePollCount = await PollModel.countDocuments({
                guild: interaction.guild.id,
                ends: {
                    $gte: new Date(),
                },
            });
            const pollsLimit = checkFeature(tier, Feature.TimedPolls) as number;
            if (activePollCount >= pollsLimit) {
                return await interaction.editReply(premiumLimitUpsell(interaction, "premiumLimitPolls", pollsLimit, tier));
            }
        }

        // calculate end date
        const expectedEndDate = timer ? new Date(Date.now() + timer * 36e5) : null;

        const poll = await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: "POLL",
                    },
                    title: question,
                    fields: options.map((option, i) => ({
                        name: this.reactions[i],
                        value: option,
                    })),
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "End Poll",
                            style: ButtonStyle.Secondary,
                            customId: MessageComponents.PollEndButton,
                        },
                    ],
                },
            ],
        });

        if (expectedEndDate) {
            // create the poll document
            await PollModel.create({
                _id: poll.id,
                channel: poll.channelId,
                guild: poll.guildId,
                ends: expectedEndDate,
            });
        }

        for (const i of options.keys()) {
            await poll.react(this.reactions[i]).catch(Logger.ignore);
        }
    }
}

export { PollCommand as Command };
