import { Client } from "tesseract";
import { Guild, GuildMember } from "discord.js";

import MemberModel from "../models/Member";

export = class BastionGuildMember extends GuildMember {
    constructor(client: Client, data: object, guild: Guild) {
        super(client, data, guild);
    }

    public async getDocument() {
        return await MemberModel.findOne({
            user: this.id,
            guild: this.guild.id,
        });
    }
}
