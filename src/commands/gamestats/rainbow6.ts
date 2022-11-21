/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbedField, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import R6API from "r6api.js";

import { COLORS } from "../../utils/constants";
import { bastion } from "../../types";

class Rainbow6Command extends Command {
    constructor() {
        super({
            name: "rainbow6",
            description: "Check stats of any Rainbow 6 player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The username of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "platform",
                    description: "The platform of the player.",
                    choices: [
                        { name: "PC", value: "uplay" },
                        { name: "PlayStation", value: "psn" },
                        { name: "Xbox", value: "xbl" },
                    ],
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");
        const platform = interaction.options.getString("platform") as "uplay" | "psn" | "xbl";

        // initialize
        const r6 = new R6API(((interaction.client as Client).settings as bastion.Settings).ubisoft);

        // find user
        const users = await r6.findByUsername(platform, username);

        // check whether player exists
        if (!users?.length) return await interaction.editReply(`The profile for **${ username }** was not found in the specified platform.`);

        const progression = await r6.getProgression(platform, users[0].id);
        const ranks = await r6.getRanks(platform, users[0].id);
        const stats = await r6.getStats(platform, users[0].id);

        const fields: APIEmbedField[] = [
            {
                name: "Level",
                value: progression?.[0]?.level?.toString() || "-",
                inline: true,
            },
            {
                name: "XP",
                value: progression?.[0]?.xp?.toString() || "-",
                inline: true,
            },
        ];

        // PvP stats
        if (stats?.[0]?.pvp?.general) {
            fields.push(
                {
                    name: "Playtime",
                    value: `${ (stats?.[0]?.pvp.general.playtime / 60 / 60).toFixed(2) } hours`,
                    inline: true,
                },
                {
                    name: "Matches",
                    value: stats?.[0]?.pvp.general.matches.toString(),
                    inline: true,
                },
                {
                    name: "Wins",
                    value: stats?.[0]?.pvp.general.wins.toString(),
                    inline: true,
                },
                {
                    name: "Losses",
                    value: stats?.[0]?.pvp.general.losses.toString(),
                    inline: true,
                },
                {
                    name: "Kills",
                    value: stats?.[0]?.pvp.general.kills.toString(),
                    inline: true,
                },
                {
                    name: "Assists",
                    value: stats?.[0]?.pvp.general.assists.toString(),
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: stats?.[0]?.pvp.general.deaths.toString(),
                    inline: true,
                },
            );
        }

        // season stats
        const latestSeason = Object.values(ranks?.[0]?.seasons || {}).slice(-1)[0];

        const pvpRanked = Object.values(latestSeason?.regions || {}).find(region => region?.boards?.pvp_ranked?.matches);
        const pvpCasual = Object.values(latestSeason?.regions || {}).find(region => region?.boards?.pvp_casual?.matches);

        if (pvpRanked) {
            fields.push(
                {
                    name: `Season ${ latestSeason.seasonId }`,
                    value: latestSeason.seasonName,
                },
                {
                    name: "Rank",
                    value: pvpRanked.boards.pvp_ranked.current.name,
                    inline: true,
                },
                {
                    name: "MMR",
                    value: pvpRanked.boards.pvp_ranked.current.mmr.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Matches",
                    value: pvpRanked.boards.pvp_ranked.matches.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Wins",
                    value: pvpRanked.boards.pvp_ranked.wins.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Losses",
                    value: pvpRanked.boards.pvp_ranked.losses.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Win %",
                    value: pvpRanked.boards.pvp_ranked.winRate,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: pvpRanked.boards.pvp_ranked.kills.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: pvpRanked.boards.pvp_ranked.deaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: "K/D",
                    value: pvpRanked.boards.pvp_ranked.kd.toLocaleString(),
                    inline: true,
                },
            );
        } else if (pvpCasual) {
            fields.push(
                {
                    name: `Season ${ latestSeason.seasonId }`,
                    value: latestSeason.seasonName,
                },
                {
                    name: "Rank",
                    value: pvpCasual.boards.pvp_ranked.current.name,
                    inline: true,
                },
                {
                    name: "MMR",
                    value: pvpCasual.boards.pvp_ranked.current.mmr.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Matches",
                    value: pvpCasual.boards.pvp_ranked.matches.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Wins",
                    value: pvpCasual.boards.pvp_ranked.wins.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Losses",
                    value: pvpCasual.boards.pvp_ranked.losses.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Win %",
                    value: pvpCasual.boards.pvp_ranked.winRate,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: pvpCasual.boards.pvp_ranked.kills.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: pvpCasual.boards.pvp_ranked.deaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: "K/D",
                    value: pvpCasual.boards.pvp_ranked.kd.toLocaleString(),
                    inline: true,
                },
            );
        }

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.RAINBOW6,
                    author: {
                        name: users?.[0]?.username,
                        icon_url: users?.[0]?.avatar[500],
                    },
                    title: "Rainbow 6 — Player Stats",
                    fields: fields,
                    thumbnail: {
                        url: pvpRanked?.boards?.pvp_ranked?.current?.icon || pvpCasual?.boards?.pvp_casual?.current?.icon,
                    },
                    image: {
                        url: latestSeason?.seasonImage,
                    },
                    footer: {
                        text: "Powered by Rainbow 6",
                    },
                },
            ],
        });
    }
}

export = Rainbow6Command;
