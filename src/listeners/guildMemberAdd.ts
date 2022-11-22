/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, time } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import RoleModel from "../models/Role";
import { logGuildEvent } from "../utils/guilds";

class GuildMemberAddListener extends Listener<"guildMemberAdd"> {
    constructor() {
        super("guildMemberAdd");
    }

    handleAutoRoles = async (member: GuildMember): Promise<void> => {
        const autoRoles = await RoleModel.find({
            guild: member.guild.id,
            autoAssignable: true,
        });

        if (autoRoles.length) {
            member.roles.add(autoRoles.map(r => r._id), "Auto Assigned")
            .catch(Logger.ignore);
        }
    };

    handleGreetings = async (member: GuildMember): Promise<void> => {
        const guildDocument = await GuildModel.findById(member.guild.id);

        // identify greeting channel
        const greetingChannel = member.guild.channels.cache.get(guildDocument?.greetingChannel);

        // check whether the channel is valid
        if (!greetingChannel?.isTextBased()) return;

        greetingChannel.send({
            embeds: [
                {
                    title: "Welcome!",
                    description: guildDocument.greetingMessage,
                },
            ],
        }).then(m => {
            if (guildDocument.greetingMessageTimeout && m.deletable) {
                setTimeout(() => m.delete().catch(Logger.ignore), guildDocument.greetingMessageTimeout * 6e4).unref();
            }
        }).catch(Logger.ignore);
    };

    public async exec(member: GuildMember): Promise<void> {
        // auto roles
        this.handleAutoRoles(member).catch(Logger.error);

        // greetings
        this.handleGreetings(member).catch(Logger.error);

        await logGuildEvent(member.guild, {
            title: `${ member.user.bot ? "Bot" : "Member" } Joined`,
            fields: [
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true,
                },
                {
                    name: "ID",
                    value: member.id,
                    inline: true,
                },
                {
                    name: "Account Created",
                    value: time(member.user.createdAt),
                    inline: true,
                },
            ],
            thumbnail: {
                url: member.displayAvatarURL(),
            },
            timestamp: member.joinedAt.toISOString(),
        });
    }
}

export = GuildMemberAddListener;
