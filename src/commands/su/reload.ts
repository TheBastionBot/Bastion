/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { refreshTwitchToken } from "../../utils/twitch.js";

import type Settings from "../../utils/settings.js";

class ReloadCommand extends Command {
    constructor() {
        super({
            name: "reload",
            description: "Reload Bastion's settings and refresh expired tokens.",
            owner: true,
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        // refresh access tokens
        await refreshTwitchToken((interaction.client as Client).settings as Settings);

        await interaction.client.shard.broadcastEval(bastion => (bastion as Client).settings.load());

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "reloadSuccess"));
    }
}

export { ReloadCommand as Command };
