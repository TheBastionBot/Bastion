/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import PollModel from "../models/Poll.js";
import MessageComponents from "../utils/components.js";
import { COLORS, isPublicBastion } from "../utils/constants.js";
import { checkFeature, Feature, getPremiumTier } from "../utils/premium.js";

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
                    description: "The first option for the poll's answer.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option2",
                    description: "The first option for the poll's answer.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option3",
                    description: "The first option for the poll's answer.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "option4",
                    description: "The first option for the poll's answer.",
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
        const question = interaction.options.getString("question");
        const options = [
            interaction.options.getString("option1"),
            interaction.options.getString("option2"),
            interaction.options.getString("option3"),
            interaction.options.getString("option4"),
        ].filter(o => !!o?.trim());
        const timer = interaction.options.getInteger("timer");

        // check for limits
        if (timer && isPublicBastion(interaction.client.user.id)) {
            const tier = await getPremiumTier(interaction.guild.ownerId);
            const pollTimerLimit = checkFeature(tier, Feature.PollTimeout) as number;
            if (timer > pollTimerLimit) {
                return await interaction.editReply(`You need to upgrade from Bastion ${ tier } to run polls for more than ${ pollTimerLimit } hours.`);
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
                return await interaction.editReply(`You need to upgrade from Bastion ${ tier } to run more than ${ pollsLimit } polls simultaneously.`);
            }
        }

        // calculate end date
        const expectedEndDate = timer ? new Date(Date.now() + timer * 36e5) : null;

        const poll = await interaction.reply({
            fetchReply: true,
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
