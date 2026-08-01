/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbedField, ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";
import { GameDig, games } from "gamedig";

import { COLORS } from "../utils/constants.js";
import sanitizeMessage from "../utils/sanitizeMessage.js";

const GAMES = Object.entries(games)
    .map(([ id, game ]) => ({
        name: game.name.toLowerCase(),
        id,
        choice: { name: game.name, value: id },
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

class GameServerCommand extends Command {
    constructor() {
        super({
            name: "game-server",
            description: "Fetch information from nearly any game server that makes its status publicly available.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "game",
                    description: "The game ID for the game server.",
                    required: true,
                    autocomplete: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "hostname",
                    description: "The IP address or domain name of the game server.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "port",
                    description: "The connection port number of the game server. Use the query port if connection port doesn't work.",
                    min_value: 1,
                    max_value: 65535,
                },
            ],
        });
    }

    public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const query = interaction.options.getFocused().toLowerCase();
        const matches = GAMES.filter(game => game.name.includes(query) || game.id.includes(query));

        const starts = (game: typeof GAMES[number]): boolean => game.name.startsWith(query) || game.id.startsWith(query);

        const results = [
            ...matches.filter(starts),
            ...matches.filter(game => !starts(game)),
        ].slice(0, 25).map(game => game.choice);

        // Discord stops accepting the suggestions a few seconds after the keystroke
        await interaction.respond(results).catch(Logger.ignore);
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const locales = (interaction.client as Client).locales;
        const game = interaction.options.getString("game");
        const hostname = interaction.options.getString("hostname");
        const port = interaction.options.getInteger("port");

        // check the game against the supported games list
        if (!Object.hasOwn(games, game)) {
            return await interaction.editReply(locales.getText(interaction.guildLocale, "gameServerUnknownGame", { game }));
        }

        // fetch data from the game server
        const server = await GameDig.query({
            type: game,
            host: hostname,
            port: port,
        }).catch(() => null);

        if (!server) {
            return await interaction.editReply(locales.getText(interaction.guildLocale, "gameServerUnreachable"));
        }

        const fields: APIEmbedField[] = [];

        if (server.map) {
            fields.push({
                name: "Map",
                value: sanitizeMessage(server.map, 128),
                inline: true,
            });
        }

        fields.push({
            name: "Players",
            value: ((server.players ? server.players.length : 0) + (server.bots ? server.bots.length : 0)) + " / " + (server.maxplayers ?? "?"),
            inline: true,
        });

        if (server.connect) {
            fields.push({
                name: "Connect",
                value: "`" + sanitizeMessage(server.connect, 128) + "`",
                inline: true,
            });
        }

        if (server.players) {
            fields.push(
                ...server.players
                    .filter(player => player.name)
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .slice(0, 5)
                    .map(player => ({
                        name: sanitizeMessage((player.team ? "[" + player.team + "]" : "") + player.name, 80),
                        value: "```\n" + sanitizeMessage("SCORE " + (player.score || 0) + (player.team ? "\tTEAM " + player.team : "") + (player.ping ? "\tPING " + player.ping + "ms" : ""), 200) + "```",
                        inline: false,
                    }))
            );
        }

        // acknowledge
        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: "Game Server Stats",
                    },
                    title: server.name && sanitizeMessage(server.name, 256),
                    fields,
                    footer: {
                        text: server.ping + "ms" + (server.password ? " • Password Protected" : ""),
                    },
                },
            ],
        });
    }
}

export { GameServerCommand as Command };
