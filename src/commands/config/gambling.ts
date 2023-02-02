/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import { isPublicBastion } from "../../utils/constants.js";
import { isPremiumUser } from "../../utils/premium.js";

class GamblingCommand extends Command {
    constructor() {
        super({
            name: "gambling",
            description: "Configure gambling in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Number,
                    name: "multiplier",
                    description: "The reward multiplier.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const multiplier = interaction.options.getNumber("multiplier");

        // check for premium membership
        if (multiplier && isPublicBastion(interaction.client.user.id)) {
            if (!await isPremiumUser(interaction.guild.ownerId)) {
                return interaction.editReply("Gambling Reward Multiplier can be set to a custom value only in Premium Servers in the Public Bastion.");
            }
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update gambling settings
        guildDocument.gambling = multiplier ? true : guildDocument.gambling ? undefined : true;
        guildDocument.gamblingMultiplier = multiplier || guildDocument.gamblingMultiplier || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ guildDocument.gambling ? "enabled" : "disabled" } gambling ${ guildDocument.gambling && guildDocument.gamblingMultiplier ? `with a multiplier of ${ guildDocument.gamblingMultiplier }x` : "in the server" }.`);
    }
}

export { GamblingCommand as Command };
