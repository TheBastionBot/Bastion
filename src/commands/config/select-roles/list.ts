/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import SelectRoleGroupModel from "../../../models/SelectRoleGroup.js";
import { COLORS } from "../../../utils/constants.js";

class SelectRolesListCommand extends Command {
    constructor() {
        super({
            name: "list",
            description: "List all the Select Role Groups.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "List Select Role Groups only from this channel.",
                    channel_types: [ ChannelType.GuildAnnouncement, ChannelType.GuildText, ChannelType.GuildVoice ],
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");

        // get all the select role group documents
        const queryFilter = channel?.id ? { guild: interaction.guildId, channel: channel.id } : { guild: interaction.guildId };
        const selectRoleGroupDocuments = await SelectRoleGroupModel.find(queryFilter);

        if (selectRoleGroupDocuments?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: "Select Role Groups",
                        fields: selectRoleGroupDocuments.slice(0, 25).map((doc, i) => ({
                            name: `#${ i + 1 } — ${ doc.id }`,
                            value: `${ doc.roles?.length } roles / [Source](https://discord.com/channels/${ doc.guild }/${ doc.channel }/${ doc.id }) 🔗`,
                        })),
                        footer: {
                            text: `${ selectRoleGroupDocuments.length } Select Role Groups.`
                        },
                    },
                ],
            });
        }

        await interaction.editReply(`There are no Select Role Groups in ${ channel || "this server" }.`);
    }
}

export { SelectRolesListCommand as Command };
