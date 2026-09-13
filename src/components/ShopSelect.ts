/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { StringSelectMenuInteraction } from "discord.js";
import { Client, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { purchase } from "../utils/shop.js";

class ShopSelectMenu extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.ShopSelect,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<void> {
        await interaction.deferUpdate();

        const result = await purchase(interaction.member, interaction.values[0]);

        await interaction.editReply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, result.key, result.variables),
            components: [],
        });
    }
}

export { ShopSelectMenu as MessageComponent };
