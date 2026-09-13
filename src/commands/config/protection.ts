/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";

const LEVELS = [ "disabled", "lenient", "balanced", "strict" ];

class ProtectionCommand extends Command {
    constructor() {
        super({
            name: "protection",
            description: "Configure automatic protection against spam and raids in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "level",
                    description: "How strictly suspicious activity should be dealt with.",
                    choices: [
                        { name: "Disabled", value: 0 },
                        { name: "Lenient", value: 1 },
                        { name: "Balanced", value: 2 },
                        { name: "Strict", value: 3 },
                    ],
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const level = interaction.options.getInteger("level");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        guildDocument.protection = level || undefined;

        await guildDocument.save();

        if (!level) {
            return await interaction.editReply("I've disabled automatic protection in the server.");
        }

        return await interaction.editReply(`I've set automatic protection to **${ LEVELS[level] }** in the server.${ guildDocument.moderationLogChannel ? "" : "\n-# No moderation log channel is configured, so I won't be able to report incidents. Set one up with `/config logs mod`." }`);
    }
}

export { ProtectionCommand as Command };
