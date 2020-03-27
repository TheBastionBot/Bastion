/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { Guild, Role } from "discord.js";

import RoleModel from "../models/Role";

export = class BastionRole extends Role {
    constructor(client: Client, data: object, guild: Guild) {
        super(client, data, guild);
    }

    public async getDocument() {
        return await RoleModel.findById(this.id);
    }
}
