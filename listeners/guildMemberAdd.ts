/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";
import { GuildMember, TextChannel } from "discord.js";

import { Guild as IGuild } from "../models/Guild";
import RoleModel from "../models/Role";
import Guild = require("../structures/Guild");
import * as constants from "../utils/constants";
import * as embeds from "../utils/embeds";
import * as variables from "../utils/variables";
import * as greetings from "../assets/greetings.json";

export = class GuildMemberAddListener extends Listener {
    constructor() {
        super("guildMemberAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    handleAutoRoles = async (member: GuildMember, guild: Guild): Promise<void> => {
        const autoRoles = await RoleModel.find({
            guild: guild.id,
            autoAssignable: { $exists: true, $ne: null },
        });

        const botRoles: string[] = autoRoles.filter(role => role.autoAssignable && role.autoAssignable.forBots).map(r => r._id);
        const userRoles: string[] = autoRoles.filter(role => role.autoAssignable && role.autoAssignable.forUsers).map(r => r._id);
        const otherRoles: string[] = autoRoles.filter(role => role.autoAssignable && ((Number(role.autoAssignable.forBots) ^ Number(role.autoAssignable.forUsers)) === 0)).map(r => r._id);

        if (botRoles.length || userRoles.length || otherRoles.length) {
            member.roles.add(otherRoles.concat(member.user.bot ? botRoles : userRoles), "Auto added via Auto Roles");
        }
    }

    handleGreetings = (member: GuildMember, document: IGuild): void => {
        // check whether greetings are enabled
        if (!document.greeting) return;

        if (document.greeting.privateMessage) {
            // greet DM
            member.createDM().then(privateChannel => {
                privateChannel.send({
                    embed: {
                        ...JSON.parse(variables.replaceMemberVariables(JSON.stringify(greetingsMessage), member)),
                        footer: {
                            text: "Greetings from " + member.guild.name + ". Welcome to our server!",
                        },
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }).catch(() => {
                // this error can be ignored
            });
        }

        // check whether server greetings are enabled
        if (!document.greeting.channelId) return;
        // check whether the greeting channel is valid
        if (!member.guild.channels.cache.has(document.greeting.channelId)) return;

        // identify greetings channel
        const greetingsChannel = (member.guild.channels.cache.get(document.greeting.channelId) as TextChannel);
        // generate greetings message
        const greetingsMessage = embeds.generateEmbed(
            document.greeting.message ? document.greeting.message : greetings[Math.floor(Math.random() * greetings.length)]
        );

        // greet
        greetingsChannel.send({
            embed: {
                ...JSON.parse(variables.replaceMemberVariables(JSON.stringify(greetingsMessage), member)),
                footer: {
                    text: "Greetings!",
                },
            },
        }).then(greeting => {
            if (document.greeting.timeout && greeting.deletable) {
                greeting.delete({
                    timeout: document.greeting.timeout * 6e4,
                }).catch(() => {
                    // this error can be ignored
                });
            }
        }).catch(() => {
            // this error can be ignored
        });
    }

    handleInviteRoles = async (member: GuildMember): Promise<void> => {
        // TODO: add public bot support (with premium membership)
        if (constants.isPublicBastion(member.client.user)) return;

        // fetch guild invites
        const invites = await member.guild.fetchInvites();
        // HACK: find the match for the invite that could've been used
        const invite = invites.find(i => i.uses > (member.guild as Guild).invites[i.code]);

        // return, if the invite doesn't exist
        if (!invite) return;

        // update invite cache
        for (const invite of invites.values()) {
            (member.guild as Guild).invites[invite.code] = invite.uses || 0;
        }

        // find the roles for this invite
        const inviteRoles = await RoleModel.find({
            guild: member.guild.id,
            invite: invite.code,
        });

        if (inviteRoles && inviteRoles.length) {
            await member.roles.add(inviteRoles.map(r => r._id), "Joined using the invite " + invite.code);
        }
    }

    exec = async (member: GuildMember): Promise<void> => {
        // if it's a partial member, fetch it
        if (member.partial) {
            await member.fetch();
        }

        const guild = member.guild as Guild;

        const guildDocument = await guild.getDocument();

        // greet new members
        this.handleGreetings(member, guildDocument);

        // assign auto roles to new members
        this.handleAutoRoles(member, guild);

        // assign invite roles to new members
        this.handleInviteRoles(member).catch(Logger.error);

        // guild logs
        guild.createLog({
            event: "guildMemberAdd",
            fields: [
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true,
                },
                {
                    name: "Member ID",
                    value: member.id,
                    inline: true,
                },
                {
                    name: "Member Type",
                    value: member.user.bot ? "Bot" : "Human",
                    inline: true,
                },
                {
                    name: "Joined Discord",
                    value: member.user.createdAt.toUTCString(),
                    inline: true,
                },
            ],
            timestamp: member.joinedTimestamp,
        });
    }
}
