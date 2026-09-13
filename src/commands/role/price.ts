/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import RoleModel from "../../models/Role.js";
import { isPublicBastion } from "../../utils/constants.js";
import { checkFeature, Feature, getPremiumTier, premiumLimitUpsell } from "../../utils/premium.js";

class RolePriceCommand extends Command {
    constructor() {
        super({
            name: "price",
            description: "Put a role up for sale, so members can buy it with their Bastion Coins.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to put up for sale.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "price",
                    description: "The price for the Role. Omit it to take the role off sale.",
                    min_value: 1,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageRoles ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const price = interaction.options.getInteger("price");

        const roleDocument = await RoleModel.findById(role.id);

        if (!price) {
            if (!roleDocument?.price) {
                return await interaction.editReply(`The **${ role.name }** role isn't up for sale.`);
            }

            roleDocument.price = undefined;

            await roleDocument.save();
            return await interaction.editReply(`Members can't buy the **${ role.name }** role anymore.`);
        }

        // self assignable role can't also carry a price
        if (roleDocument?.selfAssignable) {
            return await interaction.editReply(`Members can already assign the **${ role.name }** role for free. Remove it from the self roles with \`/config self-roles\` before putting it up for sale.`);
        }

        // repricing a listed role doesn't grow the shop, so it isn't held to the limit
        if (isPublicBastion(interaction.client.user.id) && !roleDocument?.price) {
            const tier = await getPremiumTier(interaction.guild.ownerId);
            const shopRoleCount = await RoleModel.countDocuments({
                guild: interaction.guildId,
                price: { $exists: true, $ne: null },
            });

            const limit = checkFeature(tier, Feature.ShopRoles) as number;
            if (shopRoleCount >= limit) {
                return await interaction.editReply(premiumLimitUpsell(interaction, "premiumLimitShopRoles", limit, tier));
            }
        }

        await RoleModel.findByIdAndUpdate(role.id, {
            guild: interaction.guildId,
            price,
        }, {
            upsert: true,
        });

        return await interaction.editReply(`Members can now buy the **${ role.name }** role for **${ price.toLocaleString() } Bastion Coins**.`);
    }
}

export { RolePriceCommand as Command };
