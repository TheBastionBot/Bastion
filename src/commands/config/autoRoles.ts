/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import RoleModel from "../../models/Role.js";
import { isPublicBastion } from "../../utils/constants.js";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium.js";

class AutoRolesCommand extends Command {
    constructor() {
        super({
            name: "auto-roles",
            description: "Configure roles that will be auto assigned to members when they join the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to add or remove as an auto role.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "bots",
                    description: "Whether this role should be auto assigned to bots.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const bots = interaction.options.getBoolean("bots");

        if (role?.id === interaction.guildId) {
            return await interaction.editReply("**@everyone** isn't a valid role for this.");
        }

        // update auto roles
        if (role) {
            const roleDocument = await RoleModel.findById(role.id);

            // remove role as auto assignable
            if (roleDocument?.autoAssignable) {
                roleDocument.autoAssignable = undefined;
                roleDocument.bots = undefined;

                await roleDocument.save();
                return await interaction.editReply(`I won't auto assign the **${ role.name }** role anymore.`);
            }

            // check for limits
            if (isPublicBastion(interaction.client.user.id)) {
                const tier = await getPremiumTier(interaction.guild.ownerId);

                const autoRoleCount = await RoleModel.countDocuments({
                    guild: interaction.guildId,
                    autoAssignable: true,
                });

                const limit = checkFeature(tier, Feature.AutoRoles) as number;
                if (autoRoleCount >= limit) {
                    return interaction.editReply(`You need to upgrade from Bastion ${ tier } to add more than ${ limit } auto roles.`);
                }
            }

            // set role as auto assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                guild: interaction.guildId,
                autoAssignable: true,
                bots: typeof bots === "boolean" ? bots : undefined,
            }, {
                upsert: true,
            });

            return await interaction.editReply(`I'll auto assign the **${ role.name }** role to ${ bots ? "bots" : bots === false ? "users" : "members" } when they join the server.`);
        }

        const autoRoles = await RoleModel.find({
            guild: interaction.guildId,
            autoAssignable: true,
        });

        await interaction.editReply(
            autoRoles?.length
                ?   autoRoles.map(r => interaction.guild.roles.cache.has(r.id) ? interaction.guild.roles.cache.get(r.id).name: r.id).join(", ")
                :   "There are no auto assignable roles in the server."
        );
    }
}

export { AutoRolesCommand as Command };
