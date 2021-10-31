/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Role } from "discord.js";

import Guild = require("../structures/Guild");

export = class RoleCreateListener extends Listener {
    constructor() {
        super("roleCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (role: Role): Promise<void> => {
        const guild = role.guild as Guild;

        guild.createLog({
            event: "roleCreate",
            fields: [
                {
                    name: "Role Name",
                    value: role.name,
                    inline: true,
                },
                {
                    name: "Role ID",
                    value: role.id,
                    inline: true,
                },
                {
                    name: "Permissions",
                    value: role.permissions.toArray().join(", "),
                },
            ],
            footer: role.managed ? "Managed" : undefined,
            timestamp: role.createdTimestamp,
        });
    };
}
