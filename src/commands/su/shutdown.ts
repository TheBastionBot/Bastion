/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ShutdownCommand extends Command {
    constructor() {
        super({
            name: "shutdown",
            description: "Shutdown Bastion directly from Discord.",
            owner: true,
            enabled: false,
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.reply("Sayonara! 👋🏻");

        if (interaction.client.shard) {
            return await interaction.client.shard.broadcastEval(async (bastion: Client) => {
                bastion.destroy();
                await bastion.disconnectMongo();
                process.exit();
            });
        }

        interaction.client.destroy();
        await (interaction.client as Client).disconnectMongo();
        process.exit();
    }
}

export { ShutdownCommand as Command };
