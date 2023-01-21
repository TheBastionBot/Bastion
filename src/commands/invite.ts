/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class InviteCommand extends Command {
    constructor() {
        super({
            name: "invite",
            description: "Generates an instant invite for the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "temporary",
                    description: "Kick the members if they aren't assigned a role within 24 hours.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const isTemporary = interaction.options.getBoolean("temporary");

        if (interaction.channel.isThread()) {
            return await interaction.reply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "inviteThreadChannel"),
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Invite Bastion",
                                style: ButtonStyle.Link,
                                url: "https://discordapp.com/oauth2/authorize?client_id=267035345537728512&scope=bot&permissions=8",
                            },
                        ],
                    },
                ],
                ephemeral: true,
            });
        }

        if (!interaction.memberPermissions.has(PermissionFlagsBits.CreateInstantInvite)) {
            return await interaction.reply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "invitePermsError"),
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Invite Bastion",
                                style: ButtonStyle.Link,
                                url: "https://discordapp.com/oauth2/authorize?client_id=267035345537728512&scope=bot&permissions=8",
                            },
                        ],
                    },
                ],
                ephemeral: true,
            });
        }

        const invite = await interaction.guild.invites.create(interaction.channel, {
            reason: `Requested by ${ interaction.user.tag }`,
            temporary: isTemporary,
        });

        await interaction.reply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, "invite", { invite: invite.url }),
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Invite Bastion",
                            style: ButtonStyle.Link,
                            url: "https://discordapp.com/oauth2/authorize?client_id=267035345537728512&scope=bot&permissions=8",
                        },
                    ],
                },
            ],
        });
    }
}

export = InviteCommand;
