/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client } from "tesseract";
import { Guild, GuildMember } from "discord.js";
import * as mongoose from "mongoose";

import MemberModel, { Member as IGuildMember } from "../models/Member";

import BastionGuild = require("./Guild");
import BastionUser = require("./User");

export = class BastionGuildMember extends GuildMember {
    document: IGuildMember & mongoose.Document;

    constructor(client: Client, data: object, guild: Guild) {
        super(client, data, guild);
    }

    public canManage(member: GuildMember) {
        if (this.id === this.guild.ownerID) return true;
        if (member.id === this.guild.ownerID) return false;
        if (this.id === member.id) return false;
        return this.roles.highest.comparePositionTo(member.roles.highest) > 0;
    }

    public async getDocument(): Promise<IGuildMember & mongoose.Document> {
        return await MemberModel.findOne({
            user: this.id,
            guild: this.guild.id,
        });
    }

    public isMusicMaster(): boolean {
        if ((this.user as BastionUser).isOwner()) return true;
        return (this.guild as BastionGuild).document.music && (this.guild as BastionGuild).document.music.roleId && this.roles.cache.has((this.guild as BastionGuild).document.music.roleId);
    }
}
