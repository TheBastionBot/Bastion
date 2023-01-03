/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { StringSelectMenuInteraction } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";
import GuildModel from "../models/Guild";

class PrivacyServerSelectMenu extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.PrivacyServerSelect,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<unknown> {
        await interaction.deferUpdate();

        const guildId = interaction.values[0];

        const guild = interaction.client.guilds.cache.find((guild) => guild.id === guildId);
        const guildDocument = await GuildModel.findById(guildId);

        if (!guild || !guildDocument) {
            return await interaction.editReply("Server not found.");
        }

        if (!guild.members.cache.find((m) => m.id === interaction.user.id)) {
            return await interaction.editReply("You are no longer in this server.");
        }

        return await interaction.editReply(`${guildDocument.serverLogChannel ? "Content logs" : "Server logs"} are ${guildDocument.serverLogChannel && guildDocument.logContent ? "enabled" : "disabled"} in **${guild.name}**.
Your deleted or edited messages will ${guildDocument.serverLogChannel && guildDocument.logContent ? "be" : "not be"} logged.

*Please note that this may change.*`);
    }
}

export = PrivacyServerSelectMenu;
