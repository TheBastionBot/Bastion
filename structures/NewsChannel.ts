/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Guild, NewsChannel } from "discord.js";
import * as mongoose from "mongoose";

import TextChannelModel, { TextChannel as ITextChannel } from "../models/TextChannel";

export = class BastionNewsChannel extends NewsChannel {
    constructor(guild: Guild, data: Record<string, unknown>) {
        super(guild, data);
    }

    public async getDocument(): Promise<ITextChannel & mongoose.Document> {
        return await TextChannelModel.findById(this.id);
    }
}
