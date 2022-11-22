/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ChatInputCommandInteraction, ComponentType } from "discord.js";
import { Command } from "@bastion/tesseract";

class DonateCommand extends Command {
    constructor() {
        super({
            name: "donate",
            description: "See the ways you can contribute to support the Bastion bot project.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply({
            content: "Donate to support the development of Bastion to help keep it running, and enjoy an enhanced Bastion exprience.",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Become a Patron",
                            style: ButtonStyle.Link,
                            url: "https://www.patreon.com/bePatron?u=5118812",
                        },
                        {
                            type: ComponentType.Button,
                            label: "Donate",
                            style: ButtonStyle.Link,
                            url: "https://bastion.traction.one/donate",
                        },
                        {
                            type: ComponentType.Button,
                            label: "Get Premium",
                            style: ButtonStyle.Link,
                            url: "https://bastion.traction.one/premium",
                        },
                    ],
                },
            ],
        });
    }
}

export = DonateCommand;
