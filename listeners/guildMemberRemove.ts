/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";
import { GuildMember, TextChannel } from "discord.js";

import { Guild as IGuild } from "../models/Guild";
import Guild = require("../structures/Guild");
import * as embeds from "../utils/embeds";
import * as variables from "../utils/variables";
import * as farewells from "../assets/farewells.json";

export = class GuildMemberRemoveListener extends Listener {
    constructor() {
        super("guildMemberRemove", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    handleFarewells = (member: GuildMember, document: IGuild): void => {
        // check whether farewells are enabled
        if (!document.farewell || !document.farewell.channelId) return;
        // check whether the farewell channel is valid
        if (!member.guild.channels.cache.has(document.farewell.channelId)) return;

        // identify farewells channel
        const farewellsChannel = (member.guild.channels.cache.get(document.farewell.channelId) as TextChannel);
        // generate farewells message
        const farewellsMessage = embeds.generateEmbed(
            document.farewell.message ? document.farewell.message : farewells[Math.floor(Math.random() * farewells.length)]
        );

        // farewell
        farewellsChannel.send({
            embed: {
                ...(JSON.parse(variables.replaceMemberVariables(JSON.stringify(farewellsMessage), member))),
                footer: {
                    text: "farewells!",
                },
            },
        }).then(farewell => {
            if (document.farewell.timeout && farewell.deletable) {
                farewell.delete({
                    timeout: document.farewell.timeout * 6e4,
                }).catch(() => {
                    // this error can be ignored
                });
            }
        }).catch(() => {
            // this error can be ignored
        });
    }

    exec = async (member: GuildMember): Promise<void> => {
        // if it's a partial member, fetch it
        if (member.partial) {
            await member.fetch();
        }

        const guild = member.guild as Guild;

        const guildDocument = await guild.getDocument();

        // bid farewell to members leaving the server
        this.handleFarewells(member, guildDocument);

        // guild logs
        guild.createLog({
            event: "guildMemberRemove",
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
                    name: "Joined Server",
                    value: member.joinedAt.toUTCString(),
                    inline: true,
                },
            ],
        });
    }
}
