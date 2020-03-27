import { Guild, TextChannel } from "discord.js";

import TextChannelModel from "../models/TextChannel";

export = class BastionTextChannel extends TextChannel {
    constructor(guild: Guild, data: object) {
        super(guild, data);
    }

    public async getDocument() {
        return await TextChannelModel.findById(this.id);
    }
}
