/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as numbers from "../../utils/numbers";
import { COLORS } from "../../utils/constants";

class RollCommand extends Command {
    private pattern: RegExp;
    private modifierPattern: RegExp;

    constructor() {
        super({
            name: "roll",
            description: "Roll dice and see the result. Supports dice notation.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "notation",
                    description: "The dice notation.",
                },
            ],
        });

        this.pattern = /^(\d+)?(?:d(\d*))?([-+x*/]\d+)?([-+x*/]\d+)?$/i;
        this.modifierPattern = /^([-+x*/])(\d+)$/i;
    }

    private applyModifier = (result: number, modifier: string): number => {
        const [ , type, value ] = modifier.match(this.modifierPattern);

        switch (type.toLowerCase()) {
        case "+":
            return result + Number.parseInt(value);
        case "-":
            return result - Number.parseInt(value);
        case "/":
            return result / Number.parseInt(value);
        case "*":
        case "x":
            return result * Number.parseInt(value);
        default:
            return result;
        }
    };

    private applyModifiers = (result: number, modifiers: string[]): number => {
        for (const modifier of modifiers) {
            result = this.applyModifier(result, modifier);
        }
        return result;
    };

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const notation = interaction.options.getString("notation") || "1d6";

        const matches = notation.match(this.pattern);

        if (!matches?.length) {
            return await interaction.reply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "diceNotationInvalid", { notation }),
                ephemeral: true,
            });
        }

        const [ , d, f, ...modifiers ] = matches;

        // set defaults
        const dice: number = d ? Number.parseInt(d) : 1;
        const faces: number = f ? Number.parseInt(f) : 6;

        // generate the outcome
        const outcomes: number[] = [];
        for (let index = 0; index < dice; index++) {
            outcomes.push(numbers.getRandomInt(1, faces));
        }

        // calculate the result
        let result: number = outcomes.reduce((acc, curr) => acc + curr, 0);

        const fields = [];

        if (modifiers.filter(m => m).length) {
            fields.push({
                name: "Modifiers",
                value: modifiers.join(" "),
                inline: true,
            });

            result = this.applyModifiers(result, modifiers.filter(m => m));
        }

        fields.push({
            name: "Result",
            value: result.toLocaleString(),
            inline: true,
        });

        await interaction.reply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    title: "Dice Roll",
                    description: outcomes.join(" / "),
                    fields,
                },
            ],
        });
    }
}

export = RollCommand;
