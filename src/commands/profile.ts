/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import MemberModel from "../models/Member";
import { COLORS } from "../utils/constants";
import * as gamification from "../utils/gamification";
import progress from "../utils/progress";

class ProfileCommand extends Command {
    constructor() {
        super({
            name: "profile",
            description: "Displays the Bastion profile of the specified user.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose profile you want to display.",
                },
            ],
            scope: "guild",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const user = interaction.options.getUser("user") || interaction.user;

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // check whether the specified user is a server member
        const member = interaction.guild.members.cache.get(user?.id) || await interaction.guild.members.fetch(user);
        if (!member) return interaction.editReply(`${ user } is not a member of the server anymore.`);

        // get user's profile data
        const memberProfile = await MemberModel.findOne({ user: member.id, guild: interaction.guildId });

        // check whether user profile exists
        if (!memberProfile) return interaction.editReply({
            content: `A profile for ${ user } hasn't been created in the server yet.`,
            allowedMentions: {
                users: [],
            },
        });

        // calculate the rank of the member
        const rank = await MemberModel.find({ guild: interaction.guildId }, null, { sort: {
            level: -1,
            experience: -1,
            karma: -1,
            balance: -1,
        } }).countDocuments({
            $or: [
                {
                    level: { $gt: memberProfile.level },
                },
                {
                    level: memberProfile.level,
                    experience: { $gt: memberProfile.experience },
                },
                {
                    level: memberProfile.level,
                    experience: memberProfile.experience,
                    karma: { $gt: memberProfile.karma },
                },
                {
                    level: memberProfile.level,
                    experience: memberProfile.experience,
                    karma: memberProfile.karma,
                    balance: { $gt: memberProfile.balance },
                },
            ],
        });

        // calculate level progress
        const requiredXP = {
            currentLevel: gamification.computeExperience(memberProfile.level, guildDocument.gamificationMultiplier || gamification.DEFAUL_LEVELUP_MULTIPLIER),
            nextLevel: gamification.computeExperience(memberProfile.level + 1, guildDocument.gamificationMultiplier || gamification.DEFAUL_LEVELUP_MULTIPLIER),
        };

        const totalRequiredXP = {
            currentLevel: memberProfile.experience - requiredXP.currentLevel,
            nextLevel: requiredXP.nextLevel - requiredXP.currentLevel
        };

        const currentProgress = totalRequiredXP.currentLevel / totalRequiredXP.nextLevel * 100;

        // acknowledge
        return interaction.editReply({
            embeds: [
                {
                    color: user.accentColor || member.displayColor || COLORS.PRIMARY,
                    author: {
                        name: member.user.tag,
                    },
                    title: "Bastion Profile",
                    fields: [
                        {
                            name: "Rank",
                            value: (rank ? rank + 1 : 0).toString(),
                            inline: true,
                        },
                        {
                            name: "Level",
                            value: (memberProfile.level || 0).toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "XP",
                            value: (memberProfile.experience || 0).toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Karma",
                            value: (memberProfile.karma || 0).toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Bastion Coins",
                            value: (memberProfile.balance || 0).toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Infractions",
                            value: `${ (memberProfile.infractions?.length || 0).toLocaleString() } warnings`,
                            inline: true,
                        },
                        {
                            name: `Progress — ${ totalRequiredXP.currentLevel } / ${ totalRequiredXP.nextLevel } — ${ Math.round(currentProgress) }%`,
                            value: `\`${ progress(currentProgress, 35) }\``,
                        },
                    ],
                    thumbnail: {
                        url: member.displayAvatarURL(),
                    },
                    image: {
                        url: user.bannerURL(),
                    },
                },
            ],
        });
    }
}

export = ProfileCommand;
