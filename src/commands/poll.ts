/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

const QUESTION_LIMIT = 300;
const ANSWER_LIMIT = 55;
const DURATION_LIMIT = 768; // hours
const DEFAULT_DURATION = 1; // hours
const REQUIRED_ANSWERS = 2;
const ORDINALS = [ "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th" ];

class PollCommand extends Command {
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
                    max_length: QUESTION_LIMIT,
                },
                ...ORDINALS.map((ordinal, i) => ({
                    type: ApplicationCommandOptionType.String,
                    name: "option" + (i + 1),
                    description: `The ${ ordinal } option for the poll's answer.`,
                    required: i < REQUIRED_ANSWERS || undefined,
                    max_length: ANSWER_LIMIT,
                })),
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timer",
                    description: `Number of hours the poll should run. Defaults to ${ DEFAULT_DURATION } hour${ DEFAULT_DURATION === 1 ? "" : "s" }.`,
                    min_value: 1,
                    max_value: DURATION_LIMIT,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "multiple",
                    description: "Whether members can vote for more than one option.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.SendPolls ],
            clientPermissions: [ PermissionFlagsBits.SendPolls ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const question = interaction.options.getString("question").trim();

        const answers = ORDINALS
            .map((_, i) => interaction.options.getString("option" + (i + 1))?.trim())
            .filter(option => !!option)
            .map(option => ({ text: option }));

        return await interaction.reply({
            poll: {
                question: {
                    text: question,
                },
                answers,
                duration: interaction.options.getInteger("timer") ?? DEFAULT_DURATION,
                allowMultiselect: interaction.options.getBoolean("multiple") ?? false,
            },
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
    }
}

export { PollCommand as Command };
