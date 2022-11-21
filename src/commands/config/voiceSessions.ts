/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, CategoryChannel, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";
import { isPublicBastion } from "../../utils/constants";
import { isPremiumUser } from "../../utils/premium";

class VoiceSessionsCommand extends Command {
    constructor() {
        super({
            name: "voice-sessions",
            description: "Configure voice sessions in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "create",
                    description: "Name of the new voice session category.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const newSessionName = interaction.options.getString("create");

        // check for premium membership
        if (isPublicBastion(interaction.client.user.id)) {
            if (!await isPremiumUser(interaction.guild.ownerId)) {
                return interaction.editReply("Voice Sessions is only available in premium servers.");
            }
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // filter deleted channels
        guildDocument.voiceSessionCategories = guildDocument.voiceSessionCategories?.filter(id => interaction.guild.channels.cache.has(id));

        // create voice session
        if (newSessionName) {
            // create new voice session category
            const voiceSessionCategory = await interaction.guild.channels.create({
                name: newSessionName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guildId,
                        allow: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.Speak,
                        ],
                        deny: [
                            PermissionFlagsBits.AddReactions,
                            PermissionFlagsBits.Connect,
                            PermissionFlagsBits.CreateInstantInvite,
                            PermissionFlagsBits.UseApplicationCommands,
                            PermissionFlagsBits.ViewChannel,
                        ],
                    },
                ],
            });

            // create new actuator voice channel
            await interaction.guild.channels.create({
                name: "➕ Voice Session",
                type: ChannelType.GuildVoice,
                parent: voiceSessionCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guildId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.Connect,
                        ],
                        deny: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.Speak,
                        ],
                    },
                ],
            });

            // update voice session categories
            guildDocument.voiceSessionCategories = guildDocument.voiceSessionCategories?.length ? guildDocument.voiceSessionCategories?.concat(voiceSessionCategory.id) : [ voiceSessionCategory.id ];
            await guildDocument.save();

            return await interaction.editReply(`I've created a new category **${ voiceSessionCategory.name }** for voice sessions.`);
        }

        if (guildDocument.voiceSessionCategories?.length) {
            const channels: CategoryChannel[] = [];

            for (const categoryId of guildDocument.voiceSessionCategories) {
                channels.push(interaction.guild.channels.cache.get(categoryId) as CategoryChannel);
            }

            return await interaction.editReply(`The voice sessions are **${ channels.join(" ") }**.`);
        }

        return await interaction.editReply("There are no voice sessions in the server.");
    }
}

export = VoiceSessionsCommand;
