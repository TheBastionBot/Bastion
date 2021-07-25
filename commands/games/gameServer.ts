/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import * as gamedig from "gamedig";

import * as errors from "../../utils/errors";

interface Player {
    name?: string;
    team?: string;
    score?: number;
    time?: number;
    ping?: number;
    raw?: {
        frags?: number;
        ping?: number;
    };
}

export = class GameServerCommand extends Command {
    constructor() {
        super("gameServer", {
            description: "It allows you to fetch information from nearly any game server that makes its status publicly available.",
            triggers: [],
            arguments: {
                alias: {
                    host: [ "h" ],
                    port: [ "p" ],
                },
                string: [ "host", "port" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "gameServer GAME --host HOSTNAME --port PORT",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify game slug
        const game: string = argv._.join("");

        // fetch data from the game server
        const server = await gamedig.query({
            type: game as gamedig.Type,
            host: argv.host,
            port: Number.parseInt(argv.port),
        });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Game Server Stats",
                },
                title: server.name,
                description: "",
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
                            .sort((a: Player, b: Player) => b.time - a.time)
                            .sort((a, b) => b.score - a.score)
                            .sort((a: Player, b: Player) => b.raw?.frags - a.raw?.frags)
                            .map((player: Player) => ({
                                name: (player.team ? "[" + player.team + "]" : "") + player.name,
                                value: "```\nSCORE " + (player.score || player.raw?.frags || 0) + ((player.ping || player.raw?.ping) ? "\tPING " + (player.ping || player.raw?.ping) + "ms" : "") + (player.time ? "\t" + (player.time / 60).toFixed(2) + " minutes" : "") + "```",
                                inline: false,
                            }))
                            .slice(0, 5)
                        :   []
                ),
                footer: {
                    text: server.ping + "ms" + (server.password ? " • Password Protected" : ""),
                },
            },
        });
    }
}
