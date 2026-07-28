/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";
import { checkHoneypot } from "../../../utils/protection/honeypot.js";

// deliberately ordinary names. anything containing "honeypot", "trap" or a
// warning is exactly what spam bots are trained to avoid.
const NAMES = [
    "media-archive",
    "off-topic-2",
    "chat-overflow",
    "resources-old",
    "general-archive",
    "links-archive",
];

// seeded through a webhook with varied names, because a channel whose entire
// history is bot messages is as obvious a tell as a warning
const DECOYS = [
    { username: "Ava", content: "moved the old screenshots in here" },
    { username: "Kabir", content: "thanks, was looking for that one earlier" },
    { username: "Rin", content: "haven't touched this one in months" },
    { username: "Ava", content: "same, just keeping it around for the links" },
];

class HoneypotCreateCommand extends Command {
    constructor() {
        super({
            name: "create",
            description: "Set up a honeypot channel to automatically catch spam bots.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageWebhooks ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (!guildDocument) {
            return await interaction.editReply("I couldn't load this server's settings, so I haven't created anything. Please try again.");
        }

        // replacing an existing honeypot never deletes the old channel — an
        // admin may have repurposed it since, and it could hold real
        // conversation by now
        const previousChannelId = guildDocument.honeypotChannel;

        // put it beside real channels, in the busiest category
        const parent = interaction.guild.channels.cache
            .filter(channel => channel.type === ChannelType.GuildCategory)
            .sort((one, two) => two.children.cache.size - one.children.cache.size)
            .first();

        const channel = await interaction.guild.channels.create({
            name: NAMES[Math.floor(Math.random() * NAMES.length)],
            type: ChannelType.GuildText,
            parent: parent?.id,
            topic: "Older links and media.",
            reason: "User created honeypot channel.",
        }) as TextChannel;

        // seed a plausible history
        const webhook = await channel.createWebhook({ name: "Archive", reason: "Seed honeypot channel with decoy messages." }).catch(Logger.error);

        if (webhook) {
            for (const decoy of DECOYS) {
                await webhook.send({ username: decoy.username, content: decoy.content }).catch(Logger.error);
            }
            await webhook.delete("Honeypot channel was seeded with decoy messages.").catch(Logger.error);
        }

        guildDocument.honeypotChannel = channel.id;
        await guildDocument.save();

        // the channel inherits its category's overwrites, so a staff-only
        // category would seed a trap that's invisible to @everyone — catch
        // that immediately instead of waiting for someone to run `verify`
        const failed = checkHoneypot(channel, interaction.guild.members.me).filter(check => check.critical && !check.ok);

        const visibility = failed.length
            ? `\n\n\\⚠️ **The trap isn't visible yet**\n${ failed.map(check => `- ${ check.fix }`).join("\n") }`
            : "\n\n\\✅ Everyone can see and post in it. The trap is live!";

        // a stale id (channel already deleted some other way) must not
        // block anything, so this only mentions a previous channel that
        // still actually exists
        const previousChannel = previousChannelId ? interaction.guild.channels.cache.get(previousChannelId) : undefined;
        const replaced = previousChannel
            ? `\n\n> ${ previousChannel } is no longer monitored — I've pointed the honeypot at ${ channel } instead. Delete ${ previousChannel } yourself if you don't want to keep it around.`
            : "";

        return await interaction.editReply(`I've set up ${ channel } as the honeypot channel.\n\n**Tell your members not to post there.** Anyone who posts in it will be dealt with automatically, and how firmly depends on the server's protection level — established members are never punished, only reported (or, at Strict, also have the message deleted). A new account's message is removed, and it's banned when there's corroborating spam behaviour. I've given it an ordinary name and some filler messages so spam bots can't recognise it.${ visibility }${ replaced }\n\n-# Run \`/config honeypot verify\` any time to check it's still working.`);
    }
}

export { HoneypotCreateCommand as Command };
