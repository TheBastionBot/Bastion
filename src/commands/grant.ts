/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Client, Command } from "@bastion/tesseract";
import { PermissionFlagsBits, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";

import MemberModel from "../models/Member";
import GuildModel from "../models/Guild";
import { COLORS } from "../utils/constants";

class GrantCommand extends Command {
    constructor() {
        super({
            name: "grant",
            description: "It allows you to grant experience or coins to the members of the server.",
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user to grant experience or coins.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "xp",
                    description: "Amount of experience to grant.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "coins",
                    description: "Amount of coins to grant.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const xp = interaction.options.getInteger("xp");
        const coins = interaction.options.getInteger("coins");

        if (!xp && !coins) {
            return await interaction.editReply("Please grant at least 1 xp or coins.");
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
                    title: "Grant",
                    description: (interaction.client as Client).locales.getText(interaction.guildLocale, "grantMember", {
                        granter: interaction.user.tag,
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
                title: "Grant",
                description: (interaction.client as Client).locales.getText(interaction.guildLocale, "grantMembers", {
                    granter: interaction.user.tag,
                    xp: xp ? xp : 0,
                    coins: coins ? coins : 0,
                }),
            }],
        });
    }
}

export = GrantCommand;
