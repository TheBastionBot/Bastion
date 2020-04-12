/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Client, Constants } from "tesseract";
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

    public canManage(member: GuildMember): boolean {
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

    public async addInfraction(message: string): Promise<IGuildMember & mongoose.Document> {
        const member = this.document ? this.document : await this.getDocument();

        // add infraction to member
        if (member.infractions) {
            member.infractions = [ message ];
        } else {
            member.infractions.push(message);
        }


        const guild = (this.guild as BastionGuild).document
            ? (this.guild as BastionGuild).document
            : await (this.guild as BastionGuild).getDocument();

        // check guild infraction thresholds and take action
        if (guild.infractions) {
            const count = member.infractions.length;
            let action: string;

            // check whether member's infractions require kick
            if (this.kickable && member.infractions.length === guild.infractions.kickThreshold) {
                action = "Kick";

                await this.kick(member.infractions.length + " infractions.");
            }

            // check whether member's infractions require ban
            if (this.bannable && member.infractions.length === guild.infractions.banThreshold) {
                action = "Ban";

                await this.ban({
                    reason: member.infractions.length + " infractions.",
                });

                // clear all infractions once member is banned
                member.infractions = undefined;
                delete member.infractions;
            }


            if (action) {
                // message the user regarding the infraction action
                await this.send({
                    embed: {
                        color: Constants.COLORS.ORANGE,
                        description: (this.client as Client).locale.getString(guild.language, "info", "memberInfractions" + action, this.guild.name, count),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }
        }


        // save member
        return member.save();
    }

    public async clearInfractions(): Promise<IGuildMember & mongoose.Document> {
        const member = this.document ? this.document : await this.getDocument();

        member.infractions = undefined;
        delete member.infractions;

        return member.save();
    }
}
