/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { GuildMember, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger } from "@bastion/tesseract";

import MemberModel from "../models/Member.js";
import RoleModel from "../models/Role.js";
import { credit, debit } from "./economy.js";

interface PurchaseResult {
    key: string;
    variables?: Record<string, string>;
}

/**
 * Sells a role to a member, taking the coins only once every reason to refuse has been ruled
 * out. Returns the locale key describing the outcome, refused or not.
 */
export const purchase = async (member: GuildMember, roleId: Snowflake): Promise<PurchaseResult> => {
    const role = member.guild.roles.cache.get(roleId);
    const roleDocument = await RoleModel.findById(roleId);

    if (!role || !roleDocument?.price) {
        return { key: "shopRoleUnavailable", variables: { role: role?.name || roleId } };
    }

    const variables = { role: role.name, price: roleDocument.price.toLocaleString() };

    if (member.roles.cache.has(role.id)) return { key: "shopRoleOwned", variables };

    // check assignability
    const me = member.guild.members.me;
    if (!me.permissions.has(PermissionFlagsBits.ManageRoles) || me.roles.highest.comparePositionTo(role.id) <= 0 || role.managed) {
        return { key: "shopRoleUnassignable", variables };
    }

    if (!await debit(member.id, member.guild.id, roleDocument.price)) {
        const memberDocument = await MemberModel.findOne({
            user: member.id,
            guild: member.guild.id,
        });

        return {
            key: "shopInsufficientFunds",
            variables: { ...variables, balance: (memberDocument?.balance || 0).toLocaleString() },
        };
    }

    try {
        await member.roles.add(role.id);
    } catch (e) {
        await credit(member.id, member.guild.id, roleDocument.price);
        Logger.error(e);

        return { key: "shopPurchaseFailed", variables };
    }

    return { key: "shopPurchased", variables };
};
