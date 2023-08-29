/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { AutoModerationActionOptions, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class FilterEmailsCommand extends Command {
    constructor() {
        super({
            name: "emails",
            description: "Configure Email Filter AutoMod rule in the server.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // get guild document
        const guildDocument = await GuildModel.findById(interaction.guildId);

        // get the email filter rule if it exists
        const emailFilterRule = guildDocument.emailFilterRule && await interaction.guild.autoModerationRules.fetch({
            autoModerationRule: guildDocument.emailFilterRule,
            cache: false,
        }).catch(Logger.ignore);

        // toggle email filter rule if it exists
        if (emailFilterRule) {
            const newEmailFilterRule = await emailFilterRule.setEnabled(!emailFilterRule.enabled, `${ emailFilterRule.enabled ? "Disable" : "Enable" } Email Filter`);
            return await interaction.editReply(`I've ${ newEmailFilterRule.enabled ? "enabled" : "disabled" } the **${ newEmailFilterRule.name }** AutoMod rule.`);
        }

        const actions: AutoModerationActionOptions[] = [
            {
                type: AutoModerationActionType.BlockMessage,
                metadata: {
                    customMessage: "You are not allowed to send emails in this channel.",
                },
            },
            {
                type: AutoModerationActionType.Timeout,
                metadata: {
                    durationSeconds: 60,
                },
            },
        ];

        if (interaction.guild.channels.cache.has(guildDocument.moderationLogChannel)) {
            actions.push({
                type: AutoModerationActionType.SendAlertMessage,
                metadata: {
                    channel: guildDocument.moderationLogChannel,
                },
            });
        }

        // create email filter rule
        const newEmailFilterRule = await interaction.guild.autoModerationRules.create({
            enabled: true,
            name: "Block Emails",
            eventType: AutoModerationRuleEventType.MessageSend,
            triggerType: AutoModerationRuleTriggerType.Keyword,
            triggerMetadata: {
                regexPatterns: [
                    "[A-Za-z0-9.+~_-]+\\@[A-Za-z0-9.-]+\\.[A-Za-z0-9.-]+",
                ],
            },
            actions,
            reason: "Configure Email Filter",
        });

        // update email filter rule id
        guildDocument.emailFilterRule = newEmailFilterRule.id;

        // save document
        await guildDocument.save();

        return await interaction.editReply("I've configured the email filter AutoMod rule.");
    }
}

export { FilterEmailsCommand as Command };
