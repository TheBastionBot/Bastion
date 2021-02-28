/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

interface Player {
    name?: string;
    team?: string;
    score?: number;
    time?: number;
    ping?: number;
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

        const response = await omnic.makeRequest("/games/" + game + "/server/" + argv.host + "/" + argv.port);
        const server = await response.json();

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
                ].concat(server.players ? server.players.filter((player: Player) => player.name).sort((a: Player, b: Player) => b.time - a.time).sort((a: Player, b: Player) => b.score - a.score).map((player: Player) => ({
                    name: (player.team ? "[" + player.team + "]" : "") + player.name,
                    value: "```\nSCORE " + (player.score || 0) + (player.ping ? "\tPING " + player.ping + "ms" : "") + (player.time ? "\t" + (player.time / 60).toFixed(2) + " minutes" : "") + "```",
                })).slice(0, 10) : []),
                footer: {
                    text: server.ping + "ms" + (server.password ? " • Password Protected" : "") + " • Powered by Omnic",
                },
            },
        });
    }
}
