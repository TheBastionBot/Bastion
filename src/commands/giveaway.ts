/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

import GiveawayModel from "../models/Giveaway";
import MessageComponents from "../utils/components";
import { COLORS, isPublicBastion } from "../utils/constants";
import { checkFeature, Feature, getPremiumTier } from "../utils/premium";

class GiveawayCommand extends Command {
    /** The default reaction for participating. */
    private reaction: string;

    constructor() {
        super({
            name: "giveaway",
            description: "Run giveaways in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "title",
                    description: "The title for the giveaway.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "description",
                    description: "The description for the giveaway.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "winners",
                    description: "The number of winners for the giveaway.",
                    min_value: 1,
                    max_value: Number.MAX_SAFE_INTEGER,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timer",
                    description: "Number of hours the giveaway should run.",
                    min_value: 1,
                    max_value: 720,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });

        this.reaction = "🎉";
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const winners = interaction.options.getInteger("winners") || 1;
        const timer = interaction.options.getInteger("timer");

        // check for limits
        if (timer && isPublicBastion(interaction.client.user.id)) {
            const tier = await getPremiumTier(interaction.guild.ownerId);
            const giveawayTimerLimit = checkFeature(tier, Feature.GiveawayTimeout) as number;
            if (timer > giveawayTimerLimit) {
                return await interaction.editReply(`You need to upgrade from Bastion ${ tier } to run giveaways for more than ${ giveawayTimerLimit } hours.`);
            }

            // find active giveaways in the server
            const activeGiveawayCount = await GiveawayModel.countDocuments({
                guild: interaction.guild.id,
                ends: {
                    $gte: new Date(),
                },
            });
            const giveawaysLimit = checkFeature(tier, Feature.TimedGiveaways) as number;
            if (activeGiveawayCount >= giveawaysLimit) {
                return await interaction.editReply(`You need to upgrade from Bastion ${ tier } to run more than ${ giveawaysLimit } giveaways simultaneously.`);
            }
        }

        // calculate end date
        const expectedEndDate = timer ? new Date(Date.now() + timer * 36e5) : null;

        const giveaway = await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: "GIVEAWAY!",
                    },
                    title: title,
                    description: description || (interaction.client as Client).locales.getText(interaction.guildLocale, "giveawayParticipate", { reaction: this.reaction }),
                    footer: {
                        text: `${ winners } Winners`,
                    },
                    timestamp: expectedEndDate?.toISOString(),
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "End Giveaway",
                            style: ButtonStyle.Secondary,
                            customId: MessageComponents.GiveawayEndButton,
                        },
                    ],
                },
            ],
        });

        if (expectedEndDate) {
            // create the giveaway document
            await GiveawayModel.create({
                _id: giveaway.id,
                channel: giveaway.channelId,
                guild: giveaway.guildId,
                winners: winners,
                ends: expectedEndDate,
            });
        }

        await giveaway.react(this.reaction).catch(Logger.ignore);
    }
}

export = GiveawayCommand;
