/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, ComponentType, MessageFlags } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import MemberModel from "../../models/Member.js";
import RoleModel from "../../models/Role.js";
import MessageComponents from "../../utils/components.js";
import { purchase } from "../../utils/shop.js";

class RoleShopCommand extends Command {
    constructor() {
        super({
            name: "shop",
            description: "Buy roles with your Bastion Coins.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to buy.",
                },
            ],
            scope: "guild",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const role = interaction.options.getRole("role");

        const text = (key: string, variables?: Record<string, string | number>): string =>
            (interaction.client as Client).locales.getText(interaction.guildLocale, key, variables);

        if (role) {
            const result = await purchase(interaction.member, role.id);
            return await interaction.editReply(text(result.key, result.variables));
        }

        const shopRoleDocuments = await RoleModel.find({
            guild: interaction.guildId,
            price: { $exists: true, $ne: null },
        });

        const shopRoles = shopRoleDocuments.filter(doc => interaction.guild.roles.cache.has(doc._id));

        if (!shopRoles.length) return await interaction.editReply(text("shopEmpty"));

        const memberDocument = await MemberModel.findOne({
            user: interaction.user.id,
            guild: interaction.guildId,
        });

        const balance = memberDocument?.balance || 0;

        // what a member can buy comes first, then what they can't afford, then what they
        // already have; cheapest first within each
        const rank = (doc: typeof shopRoles[number]): number =>
            interaction.member.roles.cache.has(doc._id) ? 2 : doc.price > balance ? 1 : 0;

        shopRoles.sort((a, b) => rank(a) - rank(b) || a.price - b.price);

        await interaction.editReply({
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            customId: MessageComponents.ShopSelect,
                            placeholder: "Select a role to buy",
                            minValues: 1,
                            maxValues: 1,
                            options: shopRoles.slice(0, 25).map(doc => {
                                const shopRole = interaction.guild.roles.cache.get(doc._id);

                                const state = rank(doc);
                                const status = state === 2
                                    ? text("shopOptionOwned")
                                    : state === 1
                                        ? text("shopOptionUnaffordable", { shortfall: (doc.price - balance).toLocaleString() })
                                        : text("shopOptionPrice", { price: doc.price.toLocaleString() });

                                return {
                                    value: doc._id,
                                    label: shopRole.name,
                                    emoji: doc.emoji || shopRole.unicodeEmoji,
                                    description: (doc.description ? `${ status } — ${ doc.description }` : status).slice(0, 100),
                                };
                            }),
                        },
                    ],
                },
            ],
        });
    }
}

export { RoleShopCommand as Command };
