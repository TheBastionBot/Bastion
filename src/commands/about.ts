/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ChatInputCommandInteraction, ComponentType } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class AboutCommand extends Command {
    constructor() {
        super({
            name: "about",
            description: "Displays some basic information to help you get started with Bastion.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, "about"),
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Website",
                            style: ButtonStyle.Link,
                            url: "https://bastion.traction.one",
                        },
                        {
                            type: ComponentType.Button,
                            label: "Bastion Discord Server",
                            style: ButtonStyle.Link,
                            url: "https://discord.gg/fzx8fkt",
                        },
                        {
                            type: ComponentType.Button,
                            label: "Invite Bastion",
                            style: ButtonStyle.Link,
                            url: "https://discordapp.com/oauth2/authorize?client_id=267035345537728512&scope=bot&permissions=8",
                        },
                        {
                            type: ComponentType.Button,
                            label: "What's new?",
                            style: ButtonStyle.Link,
                            url: "https://github.com/TheBastionBot/Bastion/releases",
                        },
                    ],
                },
            ],
        });
    }
}

export { AboutCommand as Command };
