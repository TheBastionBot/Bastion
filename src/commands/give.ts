/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Client, Command } from "@bastion/tesseract";
import { PermissionFlagsBits, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";

import MemberModel from "../models/Member";
import GuildModel from "../models/Guild";
import { COLORS } from "../utils/constants";

class GiveCommand extends Command {
    constructor() {
        super({
            name: "give",
            description: "It allows you to give experience or coins to the members of the server.",
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user to give experience or coins.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "everyone",
                    description: "Give experience or coins to all active members."
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "xp",
                    description: "Amount of experience to give.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "coins",
                    description: "Amount of coins to give.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const everyone = interaction.options.getBoolean("everyone");
        const xp = interaction.options.getInteger("xp");
        const coins = interaction.options.getInteger("coins");

        if (!user && !everyone) {
            return await interaction.editReply("Please specify a user or set everyone to True.");
        }

        if (user && everyone) {
            return await interaction.editReply("User and everyone cannot be used together.");
        }

        if (!xp && !coins) {
            return await interaction.editReply("Please give at least 1 xp or coins.");
        }

        const guildDocument = await GuildModel.findById(interaction.guild.id);

        if (!guildDocument.gamification) {
            return await interaction.editReply("Gamification is not enabled in the server.");
        }

        if (user) {
            // get user's profile data
            // find member document or create a new one
            const memberDocument = await MemberModel.findOneAndUpdate({ user: interaction.user.id, guild: interaction.guildId }, {}, { new: true, upsert: true });

            memberDocument.experience += xp || 0;
            memberDocument.balance += coins || 0;

            // save document
            await memberDocument.save();

            // acknowledge
            return await interaction.editReply({
                embeds: [{
                    color: COLORS.GREEN,
                    author: {
                        name: interaction.guild.name,
                    },
                    title: "Give",
                    description: (interaction.client as Client).locales.getText(interaction.guildLocale, "giveMember", {
                        from: interaction.user.tag,
                        xp: xp ? xp : 0,
                        coins: coins ? coins : 0,
                        user: user.tag,
                    }),
                }],
            });
        }

        // update XP & coins
        await MemberModel.updateMany({
            guild: interaction.guild.id,
        }, {
            $inc: {
                experience: xp ? xp : 0,
                balance: coins ? coins : 0,
            },
        });

        // acknowledge
        return await interaction.editReply({
            embeds: [{
                color: COLORS.GREEN,
                author: {
                    name: interaction.guild.name,
                },
                title: "Give",
                description: (interaction.client as Client).locales.getText(interaction.guildLocale, "giveMembers", {
                    from: interaction.user.tag,
                    xp: xp ? xp : 0,
                    coins: coins ? coins : 0,
                }),
            }],
        });
    }
}

export = GiveCommand;
