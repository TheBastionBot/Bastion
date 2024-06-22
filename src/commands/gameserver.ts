/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";
import { GameDig } from "gamedig";

import { COLORS } from "../utils/constants.js";

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

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const game = interaction.options.getString("game");
        const hostname = interaction.options.getString("hostname");
        const port = interaction.options.getInteger("port");

        // fetch data from the game server
        const server = await GameDig.query({
            type: game,
            host: hostname,
            port: port,
        });

        // acknowledge
        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: "Game Server Stats",
                    },
                    title: server.name,
                    fields: [
                        {
                            name: "Map",
                            value: server.map,
                            inline: true,
                        },
                        {
                            name: "Players",
                            value: ((server.players ? server.players.length : 0) + (server.bots ? server.bots.length : 0)) + " / " + server.maxplayers,
                            inline: true,
                        },
                        {
                            name: "Connect",
                            value: "`" + server.connect + "`",
                            inline: true,
                        },
                    ].concat(
                        server.players
                            ?   server.players
                                .filter(player => player.name)
                                .sort((a, b) => b.score - a.score)
                                .map(player => ({
                                    name: (player.team ? "[" + player.team + "]" : "") + player.name,
                                    value: "```\nSCORE " + (player.score || 0) + (player.team ? "\tTEAM " + player.team : "") + (player.ping ? "\tPING " + player.ping + "ms" : "") + "```",
                                    inline: false,
                                }))
                                .slice(0, 5)
                            :   []
                    ),
                    footer: {
                        text: server.ping + "ms" + (server.password ? " • Password Protected" : ""),
                    },
                },
            ],
        });
    }
}

export { GameServerCommand as Command };
