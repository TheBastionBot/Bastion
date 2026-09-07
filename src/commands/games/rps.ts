/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

enum Choices {
    Rock = "ROCK",
    Paper = "PAPER",
    Scissor = "SCISSOR",
}

class RockPaperScissorCommand extends Command {
    private choices: string[];

    constructor() {
        super({
            name: "rps",
            description: "Play rock paper scissor with Bastion.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "choice",
                    description: "Your choice.",
                    choices: [
                        { name: "Rock", value: Choices.Rock },
                        { name: "Paper", value: Choices.Paper },
                        { name: "Scissor", value: Choices.Scissor },
                    ],
                    required: true,
                },
            ],
        });

        this.choices = [ Choices.Rock, Choices.Paper, Choices.Scissor ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const choice = interaction.options.getString("choice");

        const today = new Date();
        const isAprilFoolsDay = today.getMonth() === 3 && today.getDate() === 1;
        const isJoking = isAprilFoolsDay && Math.random() < 0.1;

        const bastionChoice: string = isJoking ? Choices.Rock : this.choices[Math.floor(Math.random() * this.choices.length)];

        const isDraw = choice === bastionChoice;
        const hasWon = (choice === Choices.Rock && bastionChoice === Choices.Scissor)
            || (choice === Choices.Paper && bastionChoice === Choices.Rock)
            || (choice === Choices.Scissor && bastionChoice === Choices.Paper);

        let result: string;

        if (isDraw) {
            result = "Damn! It's a draw, mate.";
        } else if (!hasWon) {
            result = "I win! Sorry, human. :yum:";
        } else if (isJoking && choice === Choices.Paper) {
            result = "I understand that scissors can beat paper. And I get how rock can beat scissors. But there's no way paper can beat rock. Paper is supposed to magically wrap around rock leaving it immobile? Why can't paper do this to scissors? Forget scissors, why can't paper do this to people? Why aren't sheets of notebook constantly suffocating students as they attempt to take notes in class? I'll tell you why. Because paper can't beat anybody. A rock would tear it up in seconds. When I play rock paper scissor, I always choose rock. And if you claim to have beaten me with your paper I will punch you in the face with my already chenched fist and say, \"oh sorry, i thought paper would protect you.\"";
        } else {
            result = "You win, human.";
        }

        await interaction.reply(`I chose **${ bastionChoice }**, you chose **${ choice }**. ${ result }`);
    }
}

export { RockPaperScissorCommand as Command };
