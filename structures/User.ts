/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { User } from "discord.js";

import UserModel from "../models/User";

export = class BastionUser extends User {
    constructor(client: Client, data: object) {
        super(client, data);
    }

    public async getDocument() {
        return await UserModel.findById(this.id);
    }
}
