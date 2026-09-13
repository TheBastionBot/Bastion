/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";
import { checkHoneypot } from "../../../utils/protection/honeypot.js";

class HoneypotVerifyCommand extends Command {
    constructor() {
        super({
            name: "verify",
            description: "Check whether the honeypot channel is still working.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (!guildDocument?.honeypotChannel) {
            return await interaction.editReply("No honeypot channel is set up in the server. Use `/config honeypot create` to set one up.");
        }

        const channel = interaction.guild.channels.cache.get(guildDocument.honeypotChannel);

        if (!channel) {
            return await interaction.editReply("The honeypot channel no longer exists. Use `/config honeypot create` to set up a new one.");
        }

        if (!channel.isTextBased()) {
            return await interaction.editReply("The configured honeypot channel isn't a text channel. Use `/config honeypot create` to set up a new one.");
        }

        const checks = checkHoneypot(channel, interaction.guild.members.me);

        const failed = checks.filter(check => !check.ok);

        return await interaction.editReply([
            `### The honeypot channel ${ channel } ${ failed.length ? "isn't working" : "is working" }`,
            "",
            ...checks.map(check => `- ${ check.ok ? "\\✅" : "\\❌" } ${ check.name }`),
            ...(failed.length
                ? [ "", `**Problems**\n${ failed.map(check => `- ${ check.fix }`).join("\n") }` ]
                : []),
        ].join("\n"));
    }
}

export { HoneypotVerifyCommand as Command };
