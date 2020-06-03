/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "@bastion/tesseract";
import { User } from "discord.js";
import * as mongoose from "mongoose";

import UserModel, { User as IUser } from "../models/User";

export = class BastionUser extends User {
    client: Client;
    document: IUser & mongoose.Document;

    constructor(client: Client, data: object) {
        super(client, data);
    }

    public async getDocument(): Promise<IUser & mongoose.Document> {
        return await UserModel.findById(this.id);
    }

    public isOwner(): boolean {
        return this.client.credentials.owners.includes(this.id);
    }
}
