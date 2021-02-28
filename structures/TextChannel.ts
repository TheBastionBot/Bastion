/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Guild, TextChannel } from "discord.js";
import * as mongoose from "mongoose";

import TextChannelModel, { TextChannel as ITextChannel } from "../models/TextChannel";

export = class BastionTextChannel extends TextChannel {
    constructor(guild: Guild, data: Record<string, unknown>) {
        super(guild, data);
    }

    public async getDocument(): Promise<ITextChannel & mongoose.Document> {
        return await TextChannelModel.findById(this.id);
    }
}
