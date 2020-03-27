import { Client } from "tesseract";
import { Guild } from "discord.js";

import GuildModel from "../models/Guild";

export = class BastionGuild extends Guild {
    constructor(client: Client, data: object) {
        super(client, data);
    }

    public async getDocument() {
        return await GuildModel.findById(this.id);
    }
}
