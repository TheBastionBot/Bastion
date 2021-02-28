/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Role } from "discord.js";

import Guild = require("../structures/Guild");

export = class RoleDeleteListener extends Listener {
    constructor() {
        super("roleDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (role: Role): Promise<void> => {
        const guild = role.guild as Guild;

        guild.createLog({
            event: "roleDelete",
            fields: [
                {
                    name: "Role Name",
                    value: role.name,
                    inline: true,
                },
                {
                    name: "Created",
                    value: role.createdAt.toUTCString(),
                    inline: true,
                },
            ],
            footer: role.managed ? "Managed" : undefined,
        });
    }
}
