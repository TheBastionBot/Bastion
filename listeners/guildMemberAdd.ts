/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember, TextChannel } from "discord.js";

import { Guild as IGuild } from "../models/Guild";
import Guild = require("../structures/Guild");
import * as embeds from "../utils/embeds";
import * as greetings from "../assets/greetings.json";

export = class GuildMemberAddListener extends Listener {
    constructor() {
        super("guildMemberAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    handleGreetings = (guild: Guild, document: IGuild): void => {
        // check whether greetings are enabled
        if (!document.greeting || !document.greeting.channelId) return;
        // check whether the greeting channel is valid
        if (!guild.channels.cache.has(document.greeting.channelId)) return;

        // identify greetings channel
        const greetingsChannel = (guild.channels.cache.get(document.greeting.channelId) as TextChannel);
        // generate greetings message
        const greetingsMessage = embeds.generateEmbed(
            document.greeting.message ? document.greeting.message : greetings[Math.floor(Math.random() * greetings.length)]
        );

        // greet
        greetingsChannel.send({
            embed: {
                ...greetingsMessage,
                footer: {
                    text: "Greetings!",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }

    exec = async (member: GuildMember): Promise<void> => {
        const guild = member.guild as Guild;

        const guildDocument = await guild.getDocument();

        // greet new members
        this.handleGreetings(guild, guildDocument);

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
