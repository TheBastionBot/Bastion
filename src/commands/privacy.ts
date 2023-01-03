/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction, ComponentType } from "discord.js";
import { Command } from "@bastion/tesseract";
import MessageComponents from "../utils/components";

class PrivacyCommand extends Command {
    constructor() {
        super({
            name: "privacy",
            description: "Get privacy settings in a server.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });

        const servers = interaction.client.guilds.cache
            .filter((guild) => guild.members.cache.find((u) => u.id === interaction.user.id))
            .map((guild) => ({
                value: guild.id,
                label: guild.name,
                description: `id: ${guild.id}, members: ${guild.memberCount}`
            }));
        
        if (!servers.length) {
            return await interaction.editReply({
                content: "I am not in any of the servers you are in.",
            });
        }

        return await interaction.editReply({
            content: "Please select a server.",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            customId: MessageComponents.PrivacyServerSelect,
                            minValues: 1,
                            maxValues: 1,
                            options: servers
                        }
                    ]
                }
            ]
        });
    }
}

export = PrivacyCommand;
