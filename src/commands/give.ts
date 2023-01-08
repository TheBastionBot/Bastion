/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import MemberModel from "../models/Member";
import { updateBalance, updateExperience } from "../utils/members";

class GiveCommand extends Command {
    constructor() {
        super({
            name: "give",
            description: "Give Bastion Coins and Experience Points to server members or take it from them.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose coins and XP will be updated.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "coins",
                    description: "The amount of coins you want to give or take.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "xp",
                    description: "The amount of XP you want to give or take.",
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const user = interaction.options.getUser("user");
        const coins = interaction.options.getInteger("coins");
        const xp = interaction.options.getInteger("xp");

        // check whether user is giving it to themselves
        if (interaction.user.id !== interaction.guild.ownerId && interaction.user.id === user.id) {
            return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "giveSelfError"));
        }

        // get the member document or create a new one
        const memberDocument = await MemberModel.findOneAndUpdate({
            user: user.id,
            guild: interaction.guildId,
        }, {}, { new: true, upsert: true });

        // update coins & XP
        updateBalance(memberDocument, coins);
        updateExperience(memberDocument, xp);

        // save the document
        await memberDocument.save();

        await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "giveUser", {
            coins: coins.toLocaleString(),
            xp: xp.toLocaleString(),
            user,
        }));
    }
}

export = GiveCommand;
