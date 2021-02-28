/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Role } from "discord.js";

import Guild = require("../structures/Guild");

export = class RoleUpdateListener extends Listener {
    constructor() {
        super("roleUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldRole: Role, newRole: Role): Promise<void> => {
        if (oldRole.name === newRole.name && oldRole.permissions.equals(newRole.permissions.bitfield)) return;

        const guild = oldRole.guild as Guild;

        const fields = [
            {
                name: "Role ID",
                value: oldRole.id,
                inline: true,
            },
        ];

        if (oldRole.name === newRole.name) {
            fields.push({
                name: "Role Name",
                value: oldRole.name,
                inline: true,
            });
        } else {
            fields.push(
                {
                    name: "Old Role Name",
                    value: oldRole.name,
                    inline: true,
                },
                {
                    name: "New Role Name",
                    value: newRole.name,
                    inline: true,
                },
            );
        }

        if (!oldRole.permissions.equals(newRole.permissions.bitfield)) {
            fields.push({
                name: "Permissions",
                value: newRole.permissions.toArray().join(", "),
                inline: false,
            });
        }

        guild.createLog({
            event: "roleUpdate",
            fields: fields,
            footer: oldRole.managed ? "Managed" : undefined,
            timestamp: oldRole.createdTimestamp,
        });
    }
}
