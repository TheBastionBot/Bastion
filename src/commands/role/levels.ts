/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import RoleModel from "../../models/Role";
import { isPublicBastion } from "../../utils/constants";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium";

class RoleLevelsCommand extends Command {
    constructor() {
        super({
            name: "levels",
            description: "Configure level roles. When members reach a level, they get assigned to roles in the level.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role that should be assigned to users.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "level",
                    description: "The level at which the role should be assigned.",
                    min_value: 0,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "remove",
                    description: "The level which you want to remove.",
                    min_value: 0,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageRoles ],
            clientPermissions: [ PermissionFlagsBits.ManageRoles ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const level = interaction.options.getInteger("level");
        const remove = interaction.options.getInteger("remove");

        // remove level
        if (typeof remove === "number") {
            await RoleModel.updateMany({
                guild: interaction.guildId,
                level: remove,
            }, {
                $unset: {
                    level: 1,
                },
            });

            return await interaction.editReply(`The roles assigned to **level ${ remove }** have been unassigned.`);
        }

        // set role's level
        if (role && typeof level === "number") {
            // check for limits
            if (isPublicBastion(interaction.client.user.id)) {
                const tier = await getPremiumTier(interaction.guild.ownerId);

                // find roles per level
                const levelRolesCount = await RoleModel.countDocuments({
                    guild: interaction.guildId,
                    level: level,
                });

                const levelRolesLimit = checkFeature(tier, Feature.RolesPerLevel) as number;
                if (levelRolesCount >= levelRolesLimit) {
                    return interaction.editReply(`You need to upgrade from Bastion ${ tier } to have more than ${ levelRolesLimit } roles per level.`);
                }

                if (!levelRolesCount) {
                    // find distinct role levels
                    const roleLevels = await RoleModel.distinct("level", {
                        guild: interaction.guildId,
                        level: { $exists: true, $ne: null },
                    });

                    const roleLevelsLimit = checkFeature(tier, Feature.RoleLevels) as number;
                    if (roleLevels?.length >= roleLevelsLimit) {
                        return interaction.editReply(`You need to upgrade from Bastion ${ tier } to have more than ${ roleLevelsLimit } levels for level roles.`);
                    }
                }
            }

            await RoleModel.findByIdAndUpdate(role.id, {
                guild: interaction.guildId,
                level: level,
            }, {
                upsert: true,
            });

            return await interaction.editReply({
                content: `I've assigned the ${ role } role to **level ${ level }**.`,
                allowedMentions: {
                    roles: [],
                },
            });
        }

        // get role's level
        if (role) {
            const roleDocument = await RoleModel.findById(role.id);

            return await interaction.editReply({
                content: roleDocument?.level
                    ?   `The ${ role } role assigned to **level ${ roleDocument?.level }**.`
                    :   `The ${ role } role is not assigned to any level.`,
                allowedMentions: {
                    roles: [],
                },
            });
        }

        // get roles for level
        if (typeof level === "number") {
            const roleDocuments = await RoleModel.find({
                guild: interaction.guildId,
                level: level,
            });

            if (roleDocuments?.length) {
                const roleNames = [];
                for (const roleDocument of roleDocuments) {
                    const role = interaction.guild.roles.resolve(roleDocument.id);
                    if (role?.name) roleNames.push(role.name);
                }

                return await interaction.editReply(`The roles assigned to **level ${ level }** are **${ roleNames.join("**, **") }**.`);
            }
            return await interaction.editReply(`No roles are assigned to **level ${ level }**.`);
        }

        // get roles for all levels
        const roleDocuments = await RoleModel.find({
            guild: interaction.guildId,
            level: { $exists: true, $ne: null },
        });

        if (roleDocuments?.length) {
            // segregate roles into levels
            const levelRoles: { [level: string ]: string[] } = {};
            for (const roleDocument of roleDocuments) {
                if (roleDocument.level in levelRoles) {
                    levelRoles[roleDocument.level].push(roleDocument.id);
                } else {
                    levelRoles[roleDocument.level] = [ roleDocument.id ];
                }
            }

            return await interaction.editReply(`Level roles are configured for ${ Object.entries(levelRoles).map(([ level, roles ]) => `**level ${ level } (${ roles.length } roles)**`).join(", ") }.`);
        }

        return await interaction.editReply("There are no roles that are assigned to any level in the server.");
    }
}

export = RoleLevelsCommand;
