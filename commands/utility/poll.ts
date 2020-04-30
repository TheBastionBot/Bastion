/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import PollModel from "../../models/Poll";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";

export = class PollCommand extends Command {
    /** The default poll vote reactions */
    private reactions: string[];
    /** The default timeout of the poll, in hours. */
    private defaultTimeout: number;

    constructor() {
        super("poll", {
            description: "It allows you to run polls in the server for at least an hour and at most a month. You can set at most 13 options for the poll.",
            triggers: [],
            arguments: {
                alias: {
                    timeout: [ "t" ],
                    option: [ "s" ],
                },
                number: [ "timeout" ],
                string: [ "option" ],
                coerce: {
                    timeout: (arg): number => typeof arg === "number" && numbers.clamp(arg, 1, 720),
                },
                default: {
                    timeout: 3,
                },
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_CHANNELS" ],
            syntax: [
                "poll --option OPTIONS... -- QUESTION",
                "poll --timeout HOURS --option OPTIONS... -- QUESTION",
            ],
        });

        this.reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲" ];
        this.defaultTimeout = 3;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length || !argv.option || !argv.option.length) throw new errors.CommandSyntaxError(this.name);

        const item = argv._.join(" ");
        const timeout = argv.timeout ? argv.timeout : this.defaultTimeout;

        // calculate end date
        const expectedEndDate = new Date(Date.now() + timeout * 36e5);

        // acknowledge
        const pollMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "POLL",
                },
                title: item,
                description: "React to this message with the corresponding emoji to vote for that option.",
                fields: argv.option.map((option: string, i: number) => ({
                    name: this.reactions[i],
                    value: option,
                })),
                footer: {
                    text: "Ends"
                },
                timestamp: expectedEndDate,
            },
        });

        // create the poll
        await PollModel.create({
            _id: pollMessage.id,
            channel: pollMessage.channel.id,
            guild: pollMessage.guild.id,
            ends: expectedEndDate,
        });

        // add poll reactions
        for (const reaction of this.reactions.slice(0, argv.option.length)) {
            await pollMessage.react(reaction).catch(() => {
                // this error can be ignored
            });
        }
    }
}
