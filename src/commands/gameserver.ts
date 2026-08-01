/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbedField, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import { GameDig, games } from "gamedig";

import { COLORS } from "../utils/constants.js";
import sanitizeMessage from "../utils/sanitizeMessage.js";

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
