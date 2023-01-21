/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class Magic8BallCommand extends Command {
    private choices: string[];

    constructor() {
        super({
            name: "8ball",
            description: "Ask any question to the magic 8 ball and get answers.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "question",
                    description: "The question you want to ask the magic 8 ball.",
                    required: true,
                },
            ],
        });

        this.choices = [
            "It's certain",
            "It's decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful",
        ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "8BallSays", { response: this.choices[Math.floor(Math.random() * this.choices.length)] }));
    }
}

export = Magic8BallCommand;
