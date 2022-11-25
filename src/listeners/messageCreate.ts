/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as fs from "fs";
import * as path from "path";
import { Message, Snowflake, Team } from "discord.js";
import { Client, Listener, Logger } from "@bastion/tesseract";
import * as YAML from "yaml";

import GuildModel, { Guild as GuildDocument } from "../models/Guild";
import MemberModel from "../models/Member";
import RoleModel from "../models/Role";
import TriggerModel from "../models/Trigger";
import { COLORS } from "../utils/constants";
import { generate as generateEmbed } from "../utils/embeds";
import * as gamification from "../utils/gamification";
import * as members from "../utils/members";
import * as numbers from "../utils/numbers";
import * as variables from "../utils/variables";
import { bastion } from "../types";

class MessageCreateListener extends Listener<"messageCreate"> {
    public activeUsers: Map<Snowflake, Snowflake[]>;

    constructor() {
        super("messageCreate");

        this.activeUsers = new Map<Snowflake, Snowflake[]>();
    }

    handleLevelRoles = async (message: Message, level: number): Promise<void> => {
        const roles = await RoleModel.find({
            guild: message.guild.id,
            level: { $exists: true, $ne: null },
        });

        // check whether there are any level up roles
        if (!roles?.length) return;

        // get the nearest level for which roles are available
        const nearestLevel = numbers.smallestNeighbor(level, roles.map(r => r.level));

        // identify valid roles
        const levelRoles = roles.filter(r => r.level === nearestLevel && message.guild.roles.cache.has(r._id));
        const extraRoles = roles.filter(r => r.level !== nearestLevel && message.guild.roles.cache.has(r._id));

        // update member roles
        if (levelRoles.length) {
            const memberRoles = message.member.roles.cache
            .filter(r => extraRoles.some(doc => doc.id === r.id))   // remove roles from any other level
            .map(r => r.id)
            .concat(levelRoles.map(doc => doc.id)); // add roles in the current level

            // update member roles
            message.member.roles.set(memberRoles).catch(Logger.error);
        }
    };

    handleGamification = async (message: Message<true>, guildDocument: GuildDocument): Promise<void> => {
        // get recent users
        const activeUsers = this.activeUsers.get(message.guild.id) || [];

        // check whether the member had recently gained XP
        if (activeUsers.includes(message.author.id)) return;

        // find member document or create a new one
        const memberDocument = await MemberModel.findOneAndUpdate({ user: message.author.id, guild: message.guildId }, {}, { new: true, upsert: true });

        // check whether gamification is enabled
        if (!guildDocument.gamification) return;

        // check whether member has exceeded max level or experience
        if (memberDocument.level >= gamification.MAX_LEVEL || memberDocument.experience >= gamification.MAX_EXPERIENCE(guildDocument.gamificationMultiplier)) return;

        // increment experience
        memberDocument.experience = message.member.premiumSinceTimestamp ? memberDocument.experience + 2 : memberDocument.experience + 1;

        // compute current level from new experience
        const computedLevel: number = gamification.computeLevel(memberDocument.experience, guildDocument.gamificationMultiplier);

        // level up
        if (computedLevel > memberDocument.level) {
            // credit reward amount into member's account
            await members.updateBalance(memberDocument, computedLevel * gamification.DEFAUL_CURRENCY_REWARD_MULTIPLIER);

            // achievement message
            if (guildDocument.gamificationMessages) {
                message.reply(`You've leveled up to **Level ${ computedLevel }**!`)
                .catch(Logger.ignore);
            }

            // reward level roles, if available
            this.handleLevelRoles(message, computedLevel)
                .catch(Logger.error);
        }

        // update level
        memberDocument.level = computedLevel;

        // save document
        await memberDocument.save();

        // add to recent users
        activeUsers.push(message.author.id);
        this.activeUsers.set(message.guildId, activeUsers);

        // remove the user after cooldown period
        setTimeout(() => {
            const activeUsers = this.activeUsers.get(message.guildId);
            activeUsers.splice(activeUsers.indexOf(message.author.id), 1);
            this.activeUsers.set(message.guildId, activeUsers);
        }, 13e3).unref();
    };

    handleTriggers = async (message: Message<true>): Promise<unknown> => {
        const triggers = await TriggerModel.find({ guild: message.guild.id });

        // responses
        const responseMessages: string[] = [];
        const responseReactions: string[] = [];

        for (const trigger of triggers) {
            const patternRegExp = new RegExp(trigger.pattern.replace(/\?/g, ".").replace(/\*+/g, ".*"), "ig");

            if (!patternRegExp.test(message.content)) continue;

            if (trigger.message) {
                responseMessages.push(trigger.message);
            }
            if (trigger.reactions) {
                responseReactions.push(trigger.reactions);
            }
        }

        // response message
        if (responseMessages.length) {
            const responseMessage = generateEmbed(variables.replace(responseMessages[Math.floor(Math.random() * responseMessages.length)], message));
            if (typeof responseMessage === "string") {
                return message.reply(responseMessage)
                .catch(Logger.error);
            }
            return message.reply({
                embeds: [ responseMessage ],
            })
            .catch(Logger.error);
        }

        // response reaction
        if (responseReactions.length) {
            message.react(responseReactions[Math.floor(Math.random() * responseReactions.length)])
            .catch(Logger.error);
        }
    };

    handleVotingChannel = async (message: Message<true>, guildDocument: GuildDocument): Promise<void> => {
        // check whether channel has slow mode
        if (!message.channel.rateLimitPerUser) return;

        // check whether it's a voting channel
        if (!guildDocument.votingChannels?.includes(message.channelId)) return;

        // set the message up for voting
        message.react("👍").catch(Logger.ignore);
        message.react("👎").catch(Logger.ignore);
    };

    handleKarma = async (message: Message<true>, guildDocument: GuildDocument): Promise<void> => {
        if (!message.content) return;

        // check whether gamification is enabled
        if (!guildDocument.gamification) return;

        const mentiondUsers = message.mentions.users?.filter(u => u.id !== message.author.id);
        if (mentiondUsers?.size && [ "thank you", "thankyou", "thanks" ].some(w => message.content.toLowerCase().includes(w))) {
            const users = Array.from(mentiondUsers.keys());

            await MemberModel.updateMany({
                user: {
                    $in: users,
                },
                guild: message.guild.id,
            }, {
                $inc: {
                    karma: 1,
                },
            });
        }
    };

    handleInstantResponses = async (message: Message): Promise<void> => {
        if (!message.content) return;

        const responses = YAML.parse(fs.readFileSync(path.resolve("data", "responses.yaml"), "utf8"));

        for (const response of responses) {
            if (response.messages.includes(message.content.toLowerCase())) {
                const replies: string | string[] = response.responses[Math.floor(Math.random() * response.responses.length)];

                message.reply(replies instanceof Array ? replies.join("\n") : replies)
                .catch(Logger.ignore);
            }
        }
    };

    handleDirectMessageRelay = async (message: Message): Promise<void> => {
        if (!message.content) return;

        // get the application owner
        const app = await message.client.application.fetch();
        const owner = app.owner instanceof Team ? app.owner.owner.user : app.owner;

        // check if the message author is same as the owner
        if (message.author.id === owner.id) return;

        const channel = await owner.createDM();

        // relay the message to the application owner
        await channel.send({
            embeds: [
                {
                    color: COLORS.SECONDARY,
                    author: {
                        name: `${ message.author.tag } / ${ message.author.id }`,
                        icon_url: message.author.displayAvatarURL(),
                    },
                    description: message.content,
                },
            ],
        });
    };

    public async exec(message: Message<boolean>): Promise<void> {
        // check whether message author is a bot
        if (message.author.bot) return;

        if (message.inGuild()) {
            const guildDocument = await GuildModel.findById(message.guildId);

            // gamification
            this.handleGamification(message, guildDocument).catch(Logger.error);
            // message triggers
            this.handleTriggers(message).catch(Logger.error);
            // voting channel
            this.handleVotingChannel(message, guildDocument).catch(Logger.error);
            // karma
            this.handleKarma(message, guildDocument).catch(Logger.error);
        } else {
            if (process.env.BASTION_RELAY_DMS || ((message.client as Client).settings as bastion.Settings)?.relayDirectMessages) {
                // relay direct messages
                this.handleDirectMessageRelay(message).catch(Logger.error);
            } else {
                // instant responses
                this.handleInstantResponses(message).catch(Logger.error);
            }
        }
    }
}

export = MessageCreateListener;
