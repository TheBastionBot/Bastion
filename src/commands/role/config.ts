/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildPremiumTier } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import RoleModel from "../../models/Role";
import { parseEmoji } from "../../utils/emojis";
import * as snowflake from "../../utils/snowflake";

class RoleConfigCommand extends Command {
    constructor() {
        super({
            name: "config",
            description: "Set the description & emoji of the specified role.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role which you want to configure.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "emoji",
                    description: "The emoji you want to set as the role emoji.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "description",
                    description: "A description for the role (max 100 characters).",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const text = interaction.options.getString("emoji");
        const description = interaction.options.getString("description");

        const emoji = parseEmoji(text);

        if (emoji) {
            // check whether the emoji is a custom emoji
            const isCustomEmoji = snowflake.isValid(emoji);

            // check whether the custom emoji is from the guild
            if (isCustomEmoji && !interaction.guild.emojis.cache.has(emoji)) {
                return await interaction.editReply("You can only use custom emojis from this server as role emojis.");
            }

            // set the role emoji as role icon if role icons are supported
            if (interaction.guild.premiumTier > GuildPremiumTier.Tier1) {
                await role.setIcon(emoji).catch(Logger.ignore);
            }

            // set the role emoji
            await RoleModel.findByIdAndUpdate(role.id, {
                guild: interaction.guildId,
                emoji: emoji,
            }, {
                upsert: true,
            });

            return await interaction.editReply(`I've set ${ isCustomEmoji ? interaction.guild.emojis.cache.get(emoji) : emoji } as the role emoji for the ${ role } role.`);
        }

        if (description) {
            // set the role description
            await RoleModel.findByIdAndUpdate(role.id, {
                guild: interaction.guildId,
                description: description.slice(0, 100),
            }, {
                upsert: true,
            });

            return await interaction.editReply(`I've set the role description to **${ description }**.`);
        }

        // get the role document
        const roleDocument = await RoleModel.findById(role.id);

        if (roleDocument.id) {
            // delete the role description
            roleDocument.description = undefined;
            delete roleDocument.description;
            // delete the role emoji
            roleDocument.emoji = undefined;
            delete roleDocument.emoji;

            // save the role document
            await roleDocument.save();

            return await interaction.editReply(`I've removed the role description and emoji of the ${ role } role.`);
        }

        return await interaction.editReply(`The ${ role } role doesn't have any description or emoji.`);
    }
}

export = RoleConfigCommand;
