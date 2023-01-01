/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed, GuildMember, time } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import RoleModel from "../models/Role";
import { COLORS } from "../utils/constants";
import { generate as generateEmbed } from "../utils/embeds";
import { logGuildEvent } from "../utils/guilds";
import * as variables from "../utils/variables";
import * as yaml from "../utils/yaml";

class GuildMemberAddListener extends Listener<"guildMemberAdd"> {
    private greetings: string[];

    constructor() {
        super("guildMemberAdd");

        this.greetings = yaml.parse("data", "greetings.yaml") as unknown as string[];
    }

    handleAutoRoles = async (member: GuildMember): Promise<void> => {
        const autoRoleDocuments = await RoleModel.find({
            guild: member.guild.id,
            autoAssignable: true,
        });

        const autoRoles = autoRoleDocuments.filter(r => r.bots !== (member.user.bot ? false : true)).map(r => r._id);

        if (autoRoles.length) {
            member.roles.add(autoRoles, "Auto Assigned")
                .catch(Logger.ignore);
        }
    };

    handleGreetings = async (member: GuildMember): Promise<void> => {
        const guildDocument = await GuildModel.findById(member.guild.id);

        // identify greeting channel
        const greetingChannel = member.guild.channels.cache.get(guildDocument?.greetingChannel);

        // check whether the channel is valid
        if (!greetingChannel?.isTextBased()) return;

        const greetingMessage = generateEmbed(variables.replace(guildDocument.greetingMessage || this.greetings[Math.floor(Math.random() * this.greetings.length)], member), true) as APIEmbed;

        greetingChannel.send({
            embeds: [
                {
                    ...greetingMessage,
                    color: COLORS.SECONDARY,
                    footer: {
                        text: "Greetings!"
                    },
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
