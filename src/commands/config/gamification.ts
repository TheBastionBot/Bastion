/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";
import { isPublicBastion } from "../../utils/constants";
import { isPremiumUser } from "../../utils/premium";

class GamificationCommand extends Command {
    constructor() {
        super({
            name: "gamification",
            description: "Configure gamification in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "messages",
                    description: "Should it show the level up messages.",
                },
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
        const messages = interaction.options.getBoolean("messages");
        const multiplier = interaction.options.getNumber("multiplier");

        // check for premium membership
        if (multiplier && isPublicBastion(interaction.client.user.id)) {
            if (!await isPremiumUser(interaction.guild.ownerId)) {
                return interaction.editReply("Gamification Multiplier can be set to a custom value only in Premium Servers in the Public Bastion.");
            }
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update gamification settings
        guildDocument.gamification = messages || multiplier ? true : guildDocument.gamification ? undefined : true;
        guildDocument.gamificationMessages = typeof messages === "boolean" ? messages : guildDocument.gamificationMessages || undefined;
        guildDocument.gamificationMultiplier = multiplier || guildDocument.gamificationMultiplier || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ guildDocument.gamification ? "enabled" : "disabled" } gamification ${ guildDocument.gamification && guildDocument.gamificationMultiplier ? `with a multiplier of ${ guildDocument.gamificationMultiplier }x` : "in the server" }.`);
    }
}

export = GamificationCommand;
