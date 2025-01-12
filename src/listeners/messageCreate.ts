/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChannelType, GuildTextBasedChannel, Message, Snowflake, Team, ThreadAutoArchiveDuration } from "discord.js";
import { Client, Listener, Logger } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild.js";
import MemberModel from "../models/Member.js";
import RoleModel from "../models/Role.js";
import TriggerModel from "../models/Trigger.js";
import { COLORS } from "../utils/constants.js";
import { generate as generateEmbed } from "../utils/embeds.js";
import * as gamification from "../utils/gamification.js";
import * as members from "../utils/members.js";
import * as numbers from "../utils/numbers.js";
import * as regex from "../utils/regex.js";
import Settings from "../utils/settings.js";
import * as variables from "../utils/variables.js";
import * as yaml from "../utils/yaml.js";

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
                .filter(r => !extraRoles.some(doc => doc.id === r.id))   // remove roles from any other level
                .map(r => r.id)
                .concat(levelRoles.map(doc => doc.id)); // add roles in the current level

            // update member roles
            message.member.roles.set([ ...new Set(memberRoles) ]).catch(Logger.error);
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
        members.updateExperience(memberDocument, message.member.premiumSinceTimestamp ? 2 : 1);

        // compute current level from new experience
        const computedLevel: number = gamification.computeLevel(memberDocument.experience, guildDocument.gamificationMultiplier);

        // level up
        if (computedLevel > memberDocument.level) {
            // credit reward amount into member's account
            members.updateBalance(memberDocument, computedLevel * gamification.DEFAUL_CURRENCY_REWARD_MULTIPLIER);

            // achievement message
            if (guildDocument.gamificationMessages) {
                let gamificationMessage = guildDocument.gamificationCustomMessage;
                if (guildDocument.gamificationCustomMessage) {
                    const now = new Date();
                    const [year, month, day, hour, minute] = [
                        () => now.getUTCFullYear().toString(),
                        () => (now.getUTCMonth() + 1).toString().padStart(2, "0"),
                        () => now.getUTCDate().toString().padStart(2, "0"),
                        () => now.getUTCHours().toString().padStart(2, "0"),
                        () => now.getUTCMinutes().toString().padStart(2, "0")
                    ];
                    gamificationMessage = gamificationMessage
                        .replaceAll(/%%level%%/g, `${computedLevel}`)
                        .replaceAll(/%%date%%/g, `${year()}-${month()}-${day()}`)
                        .replaceAll(/%%time%%/g, `${hour()}:${minute()}`)
                } else {
                    gamificationMessage = (message.client as Client).locales.getText(message.guild.preferredLocale, "leveledUp", { level: `Level ${ computedLevel }` });
                }

                if (guildDocument.gamificationChannel && message.guild.channels.cache.has(guildDocument.gamificationChannel)) {
                    (message.guild.channels.cache.get(guildDocument.gamificationChannel) as GuildTextBasedChannel)
                        .send(`${ message.author }, ${ gamificationMessage }`)
                        .catch(Logger.ignore);
                } else {
                    message.reply(gamificationMessage)
                        .catch(Logger.ignore);
                }
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
            }).catch(Logger.error);
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

    handleAutoThreads = async (message: Message<true>, guildDocument: GuildDocument): Promise<void> => {
        if (!message.content) return;

        // check whether the channel is valid
        if (message.channel.type !== ChannelType.GuildText) return;

        // check whether channel has slow mode
        if (!message.channel.rateLimitPerUser) return;

        // check whether auto threads is enabled in the channel
        if (!guildDocument.autoThreadChannels?.includes(message.channelId)) return;

        // create a new thread
        const thread = await message.channel.threads.create({
            type: ChannelType.PrivateThread,
            name: message.member.displayName + " — " + new Date().toDateString(),
            autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
            reason: `Auto Thread for ${ message.author.tag }`,
            invitable: true,
            startMessage: message,
        });

        thread.send({
            content: `Hello ${ message.author }!
\nThis thread has been automatically created from your message in the ${ message.channel } channel.
\n**Useful Commands**
• \`/thread name\` — Change the name of the thread.
• \`/thread close\` — Close and lock the thread once you're done.
\n*This thread will be automatically archived after 24 hours of inactivity.*`,
        }).catch(Logger.ignore);
    };

    handleInstantResponses = async (message: Message): Promise<void> => {
        if (!message.content) return;

        const responses = yaml.parse("data", "responses.yaml");

        for (const response of responses) {
            if (response.messages.includes(message.content.toLowerCase())) {
                const replies: string | string[] = response.responses[Math.floor(Math.random() * response.responses.length)];

                message.reply(replies instanceof Array ? replies.join("\n") : replies)
                    .catch(Logger.ignore);
            }
        }
    };

    handleDirectMessageRelay = async (message: Message, relayDirectMessages: boolean | string): Promise<unknown> => {
        if (!message.content) return;

        // generate the message payload
        const payload = {
            embeds: [
                {
                    color: COLORS.SECONDARY,
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL(),
                    },
                    description: message.content,
                    footer: {
                        text: message.author.id,
                    },
                },
            ],
        };

        // check whether the message should be relayed via webhook
        if (typeof relayDirectMessages === "string") {
            // match the string for a valid webhook url
            const match = relayDirectMessages.match(regex.WEBHOOK_URL);

            // check whether the match was a success
            if (!(match instanceof Array)) return;

            // get the webhook id & token from the matched array
            const [ , webhookId, webhookToken ] = match;

            // fetch the webhook
            const webhook = await message.client.fetchWebhook(webhookId, webhookToken);

            // relay the message via the webhook
            return await webhook?.send(payload);
        }

        // get the application owner
        const app = await message.client.application.fetch();
        const owner = app.owner instanceof Team ? app.owner.owner.user : app.owner;

        // check if the message author is same as the owner
        if (message.author.id === owner.id) return;

        const channel = await owner.createDM();

        // relay the message to the application owner
        await channel.send(payload);
    };

    public async exec(message: Message<boolean>): Promise<void> {
        // check whether message author is a bot
        if (message.author.bot) return;

        if (message.inGuild()) {
            let guildDocument = await GuildModel.findById(message.guildId);

            // create guild document if it wasn't found
            if (!guildDocument) {
                guildDocument = await GuildModel.findByIdAndUpdate(message.guildId, {}, { upsert: true });
            }

            // gamification
            this.handleGamification(message, guildDocument).catch(Logger.error);
            // message triggers
            this.handleTriggers(message).catch(Logger.error);
            // voting channel
            this.handleVotingChannel(message, guildDocument).catch(Logger.error);
            // karma
            this.handleKarma(message, guildDocument).catch(Logger.error);
            // auto threads
            this.handleAutoThreads(message, guildDocument).catch(Logger.error);
        } else {
            if (((message.client as Client).settings as Settings)?.relayDirectMessages) {
                // relay direct messages
                this.handleDirectMessageRelay(message, ((message.client as Client).settings as Settings)?.relayDirectMessages).catch(Logger.error);
            } else {
                // instant responses
                this.handleInstantResponses(message).catch(Logger.error);
            }
        }
    }
}

export { MessageCreateListener as Listener };
