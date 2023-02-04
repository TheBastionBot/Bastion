/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";

class FilterCommand extends Command {
    constructor() {
        super({
            name: "filter",
            description: "Configure filters in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "links",
                    description: "Whether or not to filter links.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "invites",
                    description: "Whether or not to filter invites.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "warnings",
                    description: "Whether or not to warn users when they violate the filters.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const filterLinks = interaction.options.getBoolean("links");
        const filterInvites = interaction.options.getBoolean("invites");
        const warnings = interaction.options.getBoolean("warnings");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update filter settings
        guildDocument.linkFilter = typeof filterLinks === "boolean" ? filterLinks : guildDocument.linkFilter || undefined;
        guildDocument.inviteFilter = typeof filterInvites === "boolean" ? filterInvites : guildDocument.inviteFilter || undefined;
        guildDocument.linkFilterWarnings = typeof warnings === "boolean" ? warnings : guildDocument.linkFilterWarnings || undefined;
        guildDocument.inviteFilterWarnings = typeof warnings === "boolean" ? warnings : guildDocument.inviteFilterWarnings || undefined;

        await guildDocument.save();

        return await interaction.editReply(`I've ${ guildDocument.linkFilter && guildDocument.inviteFilter ? "enabled link and invite" : guildDocument.linkFilter ? "enabled link and disabled invite" : guildDocument.inviteFilter ? "enabled invite and disabled link": "disabled link and invite" } filters in the server. ${ (guildDocument.linkFilter || guildDocument.inviteFilter) && (guildDocument.linkFilterWarnings || guildDocument.inviteFilterWarnings) ? "Users violating the filters will be warned." : "" }`);
    }
}

export { FilterCommand as Command };
