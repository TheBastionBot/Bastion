/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import MemberModel from "../models/Member.js";
import { clampedIncrement } from "../utils/economy.js";

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

        const member = { user: user.id, guild: interaction.guildId };

        // make sure the member has a profile
        await MemberModel.updateOne(member, {}, { upsert: true });

        // update coins & XP
        await MemberModel.updateOne(member, [
            {
                $set: {
                    balance: clampedIncrement("balance", coins),
                    experience: clampedIncrement("experience", xp),
                },
            },
        ], { updatePipeline: true });

        return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "giveUser", {
            coins: coins.toLocaleString(),
            xp: xp.toLocaleString(),
            user,
        }));
    }
}

export { GiveCommand as Command };
