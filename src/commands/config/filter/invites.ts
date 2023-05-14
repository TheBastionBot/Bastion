/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class FilterInvitesCommand extends Command {
    constructor() {
        super({
            name: "invites",
            description: "Configure Invite Filter AutoMod rule in the server.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // get guild document
        const guildDocument = await GuildModel.findById(interaction.guildId);

        // get the invite filter rule if it exists
        const inviteFilterRule = guildDocument.inviteFilterRule && await interaction.guild.autoModerationRules.fetch({
            autoModerationRule: guildDocument.inviteFilterRule,
            cache: false,
        }).catch(Logger.ignore);

        // toggle invite filter rule if it exists
        if (inviteFilterRule) {
            const newInviteFilterRule = await inviteFilterRule.setEnabled(!inviteFilterRule.enabled, `${ inviteFilterRule.enabled ? "Disable" : "Enable" } Invite Filter`);
            return await interaction.editReply(`I've ${ newInviteFilterRule.enabled ? "enabled" : "disabled" } the **${ newInviteFilterRule.name }** AutoMod rule.`);
        }

        // create invite filter rule
        const newInviteFilterRule = await interaction.guild.autoModerationRules.create({
            enabled: true,
            name: "Block Invites",
            eventType: AutoModerationRuleEventType.MessageSend,
            triggerType: AutoModerationRuleTriggerType.Keyword,
            triggerMetadata: {
                regexPatterns: [
                    "(?:https?://)?(?:www\\.)?(?:discord\\.gg|discord(?:app)?\\.com/invite)/[a-z0-9-.]+",
                ],
            },
            actions: [
                {
                    type: AutoModerationActionType.BlockMessage,
                    metadata: {
                        customMessage: "You are not allowed to send invites in this channel.",
                    },
                },
                {
                    type: AutoModerationActionType.SendAlertMessage,
                    metadata: {
                        channel: guildDocument.moderationLogChannel,
                    },
                },
                {
                    type: AutoModerationActionType.Timeout,
                    metadata: {
                        durationSeconds: 60,
                    },
                },
            ],
            reason: "Configure Invite Filter",
        });

        // update invite filter rule id
        guildDocument.inviteFilterRule = newInviteFilterRule.id;

        // save document
        await guildDocument.save();

        return await interaction.editReply("I've configured the invite filter AutoMod rule.");
    }
}

export { FilterInvitesCommand as Command };
