/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChannelType, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild";
import SelectRoleGroupModel from "../../../models/SelectRoleGroup";
import MessageComponents from "../../../utils/components";
import { isPublicBastion, SelectRolesType, SelectRolesUI } from "../../../utils/constants";
import { generate as generateEmbed } from "../../../utils/embeds";
import { checkFeature, Feature, getPremiumTier } from "../../../utils/premium";

class SelectRolesAddCommand extends Command {
    constructor() {
        super({
            name: "add",
            description: "Create a new Select Role Group.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The content of the Select Role Message for users.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where you want to send the Select Role Message.",
                    channel_types: [ ChannelType.GuildAnnouncement, ChannelType.GuildText, ChannelType.GuildVoice ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "type",
                    description: "The behavior of the Select Role Group.",
                    choices: [
                        { name: "Add Only", value: SelectRolesType.AddOnly },
                        { name: "Remove Only", value: SelectRolesType.RemoveOnly },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "ui",
                    description: "The variant of Select Role UI.",
                    choices: [
                        { name: "Buttons", value: SelectRolesUI.Buttons },
                        { name: "Select Menu", value: SelectRolesUI.SelectMenu },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "min",
                    description: "The minimum number of roles users are allowed to select.",
                    min_value: 1,
                    max_value: 25,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "max",
                    description: "The maximum number of roles users are allowed to select.",
                    min_value: 1,
                    max_value: 25,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const message = generateEmbed(interaction.options.getString("message"));
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        const type = interaction.options.getInteger("type");
        const ui = interaction.options.getInteger("ui");
        const min = interaction.options.getInteger("min");
        const max = interaction.options.getInteger("max");

        if (!channel.isTextBased()) return await interaction.editReply("Role select message can't be sent in this channel.");

        // check for limits
        if (isPublicBastion(interaction.client.user.id)) {
            // get the guild document
            const guildDocument = await GuildModel.findById(interaction.guildId);

            const tier = await getPremiumTier(interaction.guild.ownerId);
            const limit = checkFeature(tier, Feature.SelectRoles) as number;
            if (guildDocument.votingChannels?.length >= limit) {
                return interaction.editReply(`You need to upgrade from Bastion ${ tier } to add more than ${ limit } select role groups.`);
            }
        }

        // send the select role group message
        const selectRolesMessage = await channel.send({
            content: typeof message === "string" ? message : "",
            embeds: typeof message === "string" ? [] : [ message ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            customId: MessageComponents.SelectRolesNoRolesButton,
                            style: ButtonStyle.Danger,
                            label: "Add Roles",
                        },
                    ],
                },
            ],
        });

        // create the select role group document
        await SelectRoleGroupModel.create({
            _id: selectRolesMessage.id,
            channel: channel.id,
            guild: interaction.guildId,
            type: type || undefined,
            ui: ui !== SelectRolesUI.Buttons ? ui : undefined,
            min: ui === SelectRolesUI.SelectMenu && min ? min : undefined,
            max: ui === SelectRolesUI.SelectMenu && max ? max : undefined,
        });

        await interaction.editReply(`I've created the [Select Roles Group](<${ selectRolesMessage.url }>). You need to select the roles for this group before members can start using it.`);
    }
}

export = SelectRolesAddCommand;
