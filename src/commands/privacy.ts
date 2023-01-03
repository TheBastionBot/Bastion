/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";
import GuildModel from "../models/Guild";

class PrivacyCommand extends Command {
    constructor() {
        super({
            name: "privacy",
            description: "Get privacy settings in a server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "server",
                    description: "Server id. Get it by using /server info in the server.",
                    required: true
                }
            ]
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.options.getString("server");

        if (!/^\d{18}$/.test(guildId)) {
            await interaction.editReply("Invalid server id.");
        }

        const guild = interaction.client.guilds.cache.find((guild) => guild.id === guildId);
        
        if (!guild) {
            return await interaction.editReply("I am not in this server.");
        }
        
        if (!guild.members.cache.find((m) => m.id === interaction.user.id)) {
            return await interaction.editReply("You are not in this server.");
        }

        const guildDocument = await GuildModel.findById(guildId);

        return await interaction.editReply(`${guildDocument.serverLogChannel ? "Content logs" : "Server logs"} are ${guildDocument.serverLogChannel && guildDocument.logContent ? "enabled" : "disabled"} in **${guild.name}**.
Your deleted or edited messages will ${guildDocument.serverLogChannel && guildDocument.logContent ? "be" : "not be"} logged.

*Please note that this may change.*`);
    }
}

export = PrivacyCommand;
