/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { Guild, Role } from "discord.js";
import * as mongoose from "mongoose";

import RoleModel, { Role as IRole } from "../models/Role";

export = class BastionRole extends Role {
    public document: IRole & mongoose.Document;

    constructor(client: Client, data: object, guild: Guild) {
        super(client, data, guild);
    }

    public async fetchDocument(): Promise<IRole & mongoose.Document> {
        this.document = await RoleModel.findById(this.id);
        return this.document;
    }

    public async createDocument(role?: IRole): Promise<IRole & mongoose.Document> {
        return await RoleModel.findByIdAndUpdate(this.id, {
            guild: this.guild.id,
            ...role,
        }, {
            upsert: true,
            new: true,
        }) as IRole & mongoose.Document;
    }
}
