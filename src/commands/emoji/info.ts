/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

class EmojiInfoCommand extends Command {
    constructor() {
        super({
            name: "info",
            description: "Displays information on the specified custom emoji.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "emoji",
                    description: "The emoji you want to display.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        let identifier = interaction.options.getString("emoji");

        if (identifier.includes(":")) {
            identifier = identifier.split(":")[1];
        }

        const emoji = interaction.guild.emojis.cache.has(identifier) ? interaction.guild.emojis.cache.get(identifier) : interaction.guild.emojis.cache.find(e => e.name === identifier);

        if (emoji?.id) {
            const author = emoji?.author ?? await emoji.fetchAuthor().catch(Logger.ignore);

            return await interaction.editReply({
                content: `[${ emoji.name }](${ emoji.url }) was added by ${ author } on <t:${ Math.round(emoji.createdTimestamp / 1000) }>.`,
                allowedMentions: {
                    users: [],
                },
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "emojiCustomNotFound", { identifier }));
    }
}

export = EmojiInfoCommand;
