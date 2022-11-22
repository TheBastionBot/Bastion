/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, PartialGuildMember, time } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import { COLORS } from "../utils/constants";
import { logGuildEvent } from "../utils/guilds";
import * as variables from "../utils/variables";
import * as yaml from "../utils/yaml";

class GuildMemberRemoveListener extends Listener<"guildMemberRemove"> {
    private farewells: string[];

    constructor() {
        super("guildMemberRemove");

        this.farewells = yaml.parse("data", "farewells.yaml") as unknown as string[];
    }

    handleFarewells = async (member: GuildMember | PartialGuildMember): Promise<void> => {
        const guildDocument = await GuildModel.findById(member.guild.id);

        // identify farewell channel
        const farewellChannel = member.guild.channels.cache.get(guildDocument?.farewellChannel);

        // check whether the channel is valid
        if (!farewellChannel?.isTextBased()) return;

        farewellChannel.send({
            embeds: [
                {
                    color: COLORS.SECONDARY,
                    title: "Farewell!",
                    description: variables.replace(guildDocument.farewellMessage || this.farewells[Math.floor(Math.random() * this.farewells.length)], member),
                },
            ],
        }).then(m => {
            if (guildDocument.farewellMessageTimeout && m.deletable) {
                setTimeout(() => m.delete().catch(Logger.ignore), guildDocument.farewellMessageTimeout * 6e4).unref();
            }
        }).catch(Logger.ignore);
    };

    public async exec(member: GuildMember | PartialGuildMember): Promise<void> {
        // farewells
        this.handleFarewells(member).catch(Logger.error);

        await logGuildEvent(member.guild, {
            title: `${ member.user.bot ? "Bot" : "Member" } Left`,
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
                    name: "Joined Server",
                    value: time(member.joinedAt),
                    inline: true,
                },
            ],
            thumbnail: {
                url: member.displayAvatarURL(),
            },
            timestamp: new Date().toISOString(),
        });
    }
}

export = GuildMemberRemoveListener;
