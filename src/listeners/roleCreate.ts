/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Role } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds.js";
import { camelToTitleCase } from "../utils/strings.js";

class RoleCreateListener extends Listener<"roleCreate"> {
    constructor() {
        super("roleCreate");
    }

    public async exec(role: Role): Promise<void> {
        await logGuildEvent(role.guild, {
            color: role.color,
            title: "Role Created",
            fields: [
                {
                    name: "Name",
                    value: role.name,
                    inline: true,
                },
                {
                    name: "ID",
                    value: role.id,
                    inline: true,
                },
                {
                    name: "Permissions",
                    value: role.permissions.toArray().map(r => camelToTitleCase(r)).join(", "),
                },
            ],
            thumbnail: {
                url: role.iconURL(),
            },
            timestamp: role.createdAt.toISOString(),
        });
    }
}

export { RoleCreateListener as Listener };
