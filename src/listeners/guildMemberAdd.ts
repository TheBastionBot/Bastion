/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed, GuildMember, time } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import RoleModel from "../models/Role.js";
import { COLORS } from "../utils/constants.js";
import { generate as generateEmbed } from "../utils/embeds.js";
import { logGuildEvent } from "../utils/guilds.js";
import { evaluateJoin, isRaiding, recordJoin } from "../utils/protection/index.js";
import * as variables from "../utils/variables.js";
import * as yaml from "../utils/yaml.js";

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
        // fifty raid joins would otherwise produce fifty greeting embeds,
        // burying the raid alert moderators actually need. raid mode only
        // exists once `protection` is enabled for the guild, so this is
        // inherently opt-in and can't suppress greetings for a guild that
        // hasn't turned the feature on. checked before the database read so
        // a raid doesn't cost a query per join either.
        if (isRaiding(member.guild.id)) return;

        const guildDocument = await GuildModel.findById(member.guild.id);

        // identify greeting channel
        const greetingChannel = member.guild.channels.cache.get(guildDocument?.greetingChannel);

        // check whether the channel is valid
        if (!greetingChannel?.isTextBased()) return;

        const greetingMessage = generateEmbed(variables.replace(guildDocument.greetingMessage || this.greetings[Math.floor(Math.random() * this.greetings.length)], member), true) as APIEmbed;

        greetingChannel.send({
            embeds: [
                {
                    color: COLORS.SECONDARY,
                    ...greetingMessage,
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

    handleRaidDetection = async (member: GuildMember): Promise<void> => {
        // recording is pure in-memory; the guild document is only read once
        // the raid threshold has actually been crossed
        const joins = recordJoin(member.guild.id, member.guild.memberCount);
        if (!joins) return;

        const guildDocument = await GuildModel.findById(member.guild.id);

        if (!guildDocument) return;

        await evaluateJoin(member, guildDocument, joins);
    };

    public async exec(member: GuildMember): Promise<void> {
        // auto roles
        this.handleAutoRoles(member).catch(Logger.error);

        // raid detection runs before greetings, so a join that's part of a
        // raid can be recognised before its own greeting is sent
        this.handleRaidDetection(member).catch(Logger.error);

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
            timestamp: (member.joinedAt ?? new Date()).toISOString(),
        });
    }
}

export { GuildMemberAddListener as Listener };
