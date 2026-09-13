/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";
import * as requests from "../../utils/requests.js";

interface GameDetail {
    faceit_elo?: number;
    game_player_name?: string;
    region?: string;
    skill_level?: number;
}

interface PlayerResponse {
    player_id?: string;
    nickname?: string;
    avatar?: string;
    country?: string;
    faceit_url?: string;
    steam_nickname?: string;
    verified?: boolean;
    memberships?: string[];
    games?: { [game: string]: GameDetail };
}

class FaceitCommand extends Command {
    constructor() {
        super({
            name: "faceit",
            description: "Check the FACEIT stats of any player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "nickname",
                    description: "The FACEIT nickname of the player.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const client = interaction.client as Client;
        const nickname = interaction.options.getString("nickname");

        const game = "cs2";

        const response = await requests.get("https://open.faceit.com/data/v4/players?" + new URLSearchParams({ nickname, game }), {
            authorization: `Bearer ${ (client.settings as Settings).get("faceitApiKey") }`,
        });

        const player: PlayerResponse = await response.body.json().catch(() => null) as PlayerResponse;

        // a refused key is the operator's problem, not a player FACEIT doesn't know about
        if (response.statusCode === 400 || response.statusCode === 401 || response.statusCode === 403) {
            return await interaction.editReply(client.locales.getText(interaction.guildLocale, "searchUnavailable", { item: "FACEIT players" }));
        }

        if (response.statusCode !== 200) return await interaction.editReply(`The profile for **${ nickname }** was not found.`);

        const stats = player?.games?.[game];

        return await interaction.editReply({
            embeds: [
                {
                    color: COLORS.FACEIT,
                    author: {
                        name: "FACEIT — Player Stats",
                        icon_url: "https://unavatar.io/x/FACEIT",
                    },
                    title: player?.nickname,
                    url: player?.faceit_url?.replace("{lang}", "en"),
                    fields: [
                        ...(stats ? [
                            {
                                name: "Level",
                                value: stats.skill_level ? `Level ${ stats.skill_level }` : "-",
                                inline: true,
                            },
                            {
                                name: "Elo",
                                value: stats.faceit_elo?.toLocaleString() || "-",
                                inline: true,
                            },
                            {
                                name: "Region",
                                value: stats.region || "-",
                                inline: true,
                            },
                            {
                                name: "In-game Name",
                                value: stats.game_player_name || "-",
                                inline: true,
                            },
                        ] : [
                            {
                                name: "Level",
                                value: "This player hasn't played this game on FACEIT.",
                            },
                        ]),
                        ...(player?.country ? [
                            {
                                name: "Country",
                                value: player.country.toUpperCase(),
                                inline: true,
                            },
                        ] : []),
                        ...(player?.memberships?.length ? [
                            {
                                name: "Membership",
                                value: player.memberships.join(", "),
                                inline: true,
                            },
                        ] : []),
                    ],
                    thumbnail: {
                        url: player?.avatar || undefined,
                    },
                    footer: {
                        text: "Powered by FACEIT",
                    },
                },
            ],
        });
    }
}

export { FaceitCommand as Command };
