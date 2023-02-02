/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import MessageComponents from "../../utils/components.js";

class VerificationCommand extends Command {
    constructor() {
        super({
            name: "verification",
            description: "Configure verification in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role that should be assigned to verified users.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "text",
                    description: "Type a text message that will be shown to the users trying to verify.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const text = interaction.options.getString("text");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (text) {
            if (guildDocument.verifiedRole) {
                return await interaction.editReply({
                    content: text,
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: "I am human",
                                    style: ButtonStyle.Primary,
                                    customId: MessageComponents.VerificationButton,
                                },
                            ],
                        },
                    ],
                });
            }

            return await interaction.editReply("A role for verified users hasn't been set.");
        }

        if (role?.id === interaction.guildId) {
            return await interaction.editReply("**@everyone** isn't a valid role for this.");
        }

        // update verified role
        guildDocument.verifiedRole = role?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ role?.id ? "enabled" : "disabled" } verification${ role?.id ? ` and **${ role.name }** is the verified role` : "" } in the server.`);
    }
}

export { VerificationCommand as Command };
