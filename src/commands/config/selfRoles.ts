/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import RoleModel from "../../models/Role";
import { isPublicBastion } from "../../utils/constants";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium";

class SelfRolesCommand extends Command {
    constructor() {
        super({
            name: "self-roles",
            description: "Configure roles that users can assign to themselves.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to add or remove as a self role.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");

        if (role?.id === interaction.guildId) {
            return await interaction.editReply("**@everyone** isn't a valid role for this.");
        }

        // update self roles
        if (role) {
            const roleDocument = await RoleModel.findById(role.id);

            // remove role as self assignable
            if (roleDocument?.selfAssignable) {
                roleDocument.selfAssignable = undefined;

                await roleDocument.save();
                return await interaction.editReply(`Users can't self assign the **${ role.name }** role anymore.`);
            }

            // check for limits
            if (isPublicBastion(interaction.client.user.id)) {
                const tier = await getPremiumTier(interaction.guild.ownerId)
                const selfRoleCount = await RoleModel.countDocuments({
                    guild: interaction.guildId,
                    selfAssignable: true,
                });

                const limit = checkFeature(tier, Feature.SelfRoles) as number;
                if (selfRoleCount >= limit) {
                    return interaction.editReply(`You need to upgrade from Bastion ${ tier } to add more than ${ limit } self roles.`);
                }
            }

            // set role as self assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                guild: interaction.guildId,
                selfAssignable: true,
            }, {
                upsert: true,
            });

            return await interaction.editReply(`Users can now self assign the **${ role.name }** role.`);
        }

        const selfRoles = await RoleModel.find({
            guild: interaction.guildId,
            selfAssignable: true,
        });

        await interaction.editReply(
            selfRoles?.length
            ?   selfRoles.map(r => interaction.guild.roles.cache.has(r.id) ? interaction.guild.roles.cache.get(r.id).name: r.id).join(", ")
            :   "There are no self assignable roles in the server."
        );
    }
}

export = SelfRolesCommand;
