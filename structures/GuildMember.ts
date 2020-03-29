/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { Guild, GuildMember } from "discord.js";
import * as mongoose from "mongoose";

import MemberModel, { Member as IGuildMember } from "../models/Member";

export = class BastionGuildMember extends GuildMember {
    constructor(client: Client, data: object, guild: Guild) {
        super(client, data, guild);
    }

    public async getDocument(): Promise<IGuildMember & mongoose.Document> {
        return await MemberModel.findOne({
            user: this.id,
            guild: this.guild.id,
        });
    }
}
