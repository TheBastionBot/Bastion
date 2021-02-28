/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants, Snowflake } from "@bastion/tesseract";
import { GuildMember, Message } from "discord.js";

import * as errors from "../../utils/errors";

interface Game {
    message: Message;
    playerOne: GuildMember;
    playerTwo: GuildMember;
    board: number[];
    moves: number;
}

export = class TicTacToeCommand extends Command {
    private games: Map<Snowflake, Game>;

    constructor() {
        super("ticTacToe", {
            description: "It allows you to play a game of Tic Tac Toe with another member of the server.",
            triggers: [ "ttt" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "ticTacToe @USER",
            ],
        });

        this.games = new Map<Snowflake, Game>();
    }

    private getPositionString = (number: number): string => {
        if (number === 0) return "one";
        if (number === 1) return "two";
        if (number === 2) return "three";
        if (number === 3) return "four";
        if (number === 4) return "five";
        if (number === 5) return "six";
        if (number === 6) return "seven";
        if (number === 7) return "eight";
        if (number === 8) return "nine";
    }

    private getState = (board: number[], position: number): string => {
        if (board[position] === -1) return ":" + this.getPositionString(position) + ":";
        if (board[position] === 0) return "🇴";
        if (board[position] === 1) return "🇽";
    };

    private checkWinner = (board: number[]) => {
        // Horizontals
        if (board[0] !== -1 && board[1] === board[0] && board[2] === board[0]) return board[0];
        if (board[3] !== -1 && board[4] === board[3] && board[5] === board[3]) return board[3];
        if (board[6] !== -1 && board[7] === board[6] && board[8] === board[6]) return board[6];
        // Verticals
        if (board[0] !== -1 && board[3] === board[0] && board[6] === board[0]) return board[0];
        if (board[1] !== -1 && board[4] === board[1] && board[7] === board[1]) return board[1];
        if (board[2] !== -1 && board[5] === board[2] && board[8] === board[2]) return board[2];
        // Diagonals
        if (board[0] !== -1 && board[4] === board[0] && board[8] === board[0]) return board[0];
        if (board[2] !== -1 && board[4] === board[2] && board[6] === board[2]) return board[2];
        return null;
    }

    private collectMove = async (gameId: Snowflake) => {
        const game = this.games.get(gameId);

        // collect move
        const move = await game.message.channel.awaitMessages(
            (m: Message) => !m.author.bot && m.content.length === 1 && Number.parseInt(m.content) > 0 && Number.parseInt(m.content) < 10 && game.board[Number.parseInt(m.content) - 1] === -1 && (game.moves % 2 === 0 ? m.member.id === game.playerOne.id : m.member.id === game.playerTwo.id),
            { time: 15e3, max: 1 },
        );

        if (move.size !== 1) {
            // delete game
            this.games.delete(gameId);

            throw new Error((game.moves % 2 === 0 ? game.playerOne : game.playerTwo).displayName + " didn't make a move. Game terminated.");
        }

        game.board[Number.parseInt(move.first().content) - 1] = game.moves % 2 === 0 ? 1 : 0;
        game.moves += 1;

        this.games.set(gameId, game);

        await game.message.edit({
            embed: {
                ...game.message.embeds[0],
                fields: [
                    game.message.embeds[0].fields[0],
                    game.message.embeds[0].fields[1],
                    {
                        name: "Board",
                        // eslint-disable-next-line no-irregular-whitespace
                        value: `${this.getState(game.board, 0)} ${this.getState(game.board, 1)} ${this.getState(game.board, 2)}\n\n${this.getState(game.board, 3)} ${this.getState(game.board, 4)} ${this.getState(game.board, 5)}\n\n${this.getState(game.board, 6)} ${this.getState(game.board, 7)} ${this.getState(game.board, 8)}`,
                    },
                ],
            },
        });
    }

    exec = async (message: Message): Promise<void> => {
        if (!message.mentions.members.size) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // check whether a game is already running in the channel
        if (this.games.has(message.channel.id)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, "A game is already running in this channel. Wait for it to end before starting another.");

        // start game
        const gameMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.INDIGO,
                title: "Tic Tac Toe",
                description: "Players can type the position number to make their moves.",
                fields: [
                    {
                        name: "🇽 Player One",
                        value: message.member.displayName,
                        inline: true,
                    },
                    {
                        name: "🇴 Player Two",
                        value: message.mentions.members.first().displayName,
                        inline: true,
                    },
                    {
                        name: "Board",
                        value: ":one: :two: :three:\n\n:four: :five: :six:\n\n:seven: :eight: :nine:",
                    },
                ],
                footer: {
                    text: "You have 15 seconds to make each move.",
                },
            },
        });

        // initialize current game
        this.games.set(message.channel.id, {
            playerOne: message.member,
            playerTwo: message.mentions.members.first(),
            message: gameMessage,
            board: new Array(9).fill(-1),
            moves: 0,
        });

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // collect move
            await this.collectMove(message.channel.id);

            const game = this.games.get(message.channel.id);

            if (!game) break;

            const winner = this.checkWinner(game.board);

            if (typeof winner === "number") {
                // delete game
                this.games.delete(message.channel.id);

                // acknowledge winner
                message.channel.send({
                    embed: {
                        color: Constants.COLORS.SOMEWHAT_DARK,
                        author: {
                            name: "Tic Tac Toe",
                        },
                        title: "Game Ended",
                        description: "**" + (winner ? game.playerOne : game.playerTwo).displayName + "** won against **" + (winner ? game.playerTwo : game.playerOne).displayName + "**.",
                    },
                }).catch(() => {
                    // this error can be ignored
                });

                break;
            }

            if (game.moves === 9) {
                // delete game
                this.games.delete(message.channel.id);

                // acknowledge tie
                message.channel.send({
                    embed: {
                        color: Constants.COLORS.SOMEWHAT_DARK,
                        author: {
                            name: "Tic Tac Toe",
                        },
                        title: "Game Ended",
                        description: "The game ended in a tie between **" + game.playerOne.displayName + "** and **" + game.playerTwo.displayName + "**.",
                    },
                }).catch(() => {
                    // this error can be ignored
                });

                break;
            }
        }
    }
}
