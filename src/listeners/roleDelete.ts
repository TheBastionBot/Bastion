/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Role, time } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import RoleModel from "../models/Role.js";
import { logGuildEvent } from "../utils/guilds.js";

class RoleDeleteListener extends Listener<"roleDelete"> {
    constructor() {
        super("roleDelete");
    }

    public async exec(role: Role): Promise<void> {
        await RoleModel.deleteOne({ _id: role.id }).catch(Logger.error);

        await logGuildEvent(role.guild, {
            color: role.color,
            title: "Role Deleted",
            fields: [
                {
                    name: "Name",
                    value: role.name,
                    inline: true,
                },
                {
                    name: "Created",
                    value: time(role.createdAt),
                    inline: true,
                },
            ],
            thumbnail: {
                url: role.iconURL(),
            },
            timestamp: new Date().toISOString(),
        });
    }
}

export { RoleDeleteListener as Listener };
