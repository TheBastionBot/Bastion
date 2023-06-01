/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { AutoModerationActionOptions, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class FilterLinksCommand extends Command {
    constructor() {
        super({
            name: "links",
            description: "Configure Link Filter AutoMod rule in the server.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // get guild document
        const guildDocument = await GuildModel.findById(interaction.guildId);

        // get the link filter rule if it exists
        const linkFilterRule = guildDocument.linkFilterRule && await interaction.guild.autoModerationRules.fetch({
            autoModerationRule: guildDocument.linkFilterRule,
            cache: false,
        }).catch(Logger.ignore);

        // toggle link filter rule if it exists
        if (linkFilterRule) {
            const newLinkFilterRule = await linkFilterRule.setEnabled(!linkFilterRule.enabled, `${ linkFilterRule.enabled ? "Disable" : "Enable" } Link Filter`);
            return await interaction.editReply(`I've ${ newLinkFilterRule.enabled ? "enabled" : "disabled" } the **${ newLinkFilterRule.name }** AutoMod rule.`);
        }

        const actions: AutoModerationActionOptions[] = [
            {
                type: AutoModerationActionType.BlockMessage,
                metadata: {
                    customMessage: "You are not allowed to send links in this channel.",
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

        // create link filter rule
        const newLinkFilterRule = await interaction.guild.autoModerationRules.create({
            enabled: true,
            name: "Block Links",
            eventType: AutoModerationRuleEventType.MessageSend,
            triggerType: AutoModerationRuleTriggerType.Keyword,
            triggerMetadata: {
                regexPatterns: [
                    "https?://(?:[-;:&=+$,\\w]+@)?[A-Za-z0-9.-]+",
                ],
            },
            actions,
            reason: "Configure Link Filter",
        });

        // update link filter rule id
        guildDocument.linkFilterRule = newLinkFilterRule.id;

        // save document
        await guildDocument.save();

        return await interaction.editReply("I've configured the link filter AutoMod rule.");
    }
}

export { FilterLinksCommand as Command };
