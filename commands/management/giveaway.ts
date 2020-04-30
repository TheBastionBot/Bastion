/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import GiveawayModel from "../../models/Giveaway";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";

export = class GiveawayCommand extends Command {
    /** The default reactions for participating. */
    private reactions: string[];
    /** The default timeout of the giveaway, in hours. */
    private defaultTimeout: number;
    /** The default number of winners for the giveaway. */
    private defaultWinners: number;

    constructor() {
        super("giveaway", {
            description: "It allows you to run giveaway events in the server for at least an hour and at most a week. You can set any number of winners for the event. And it also allows you to reroll the winners, if need be, after the end of the event.",
            triggers: [],
            arguments: {
                alias: {
                    timeout: [ "t" ],
                    winners: [ "w" ],
                },
                number: [ "timeout", "winners" ],
                coerce: {
                    timeout: (arg): number => typeof arg === "number" && numbers.clamp(arg, 1, 720),
                    winners: (arg): number => typeof arg === "number" && Math.floor(numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER)),
                },
                default: {
                    timeout: 3,
                    winners: 1,
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
                "giveaway -- ITEM",
                "giveaway --winners NUMBER -- ITEM",
                "giveaway --timeout HOURS -- ITEM",
            ],
        });

        this.reactions = [ "🎊", "🎉" ];
        this.defaultTimeout = 3;
        this.defaultWinners = 1;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        const item = argv._.join(" ");
        const timeout = argv.timeout ? argv.timeout : this.defaultTimeout;
        const winners = argv.winners ? argv.winners : this.defaultWinners;

        // calculate end date
        const expectedEndDate = new Date(Date.now() + timeout * 36e5);

        // acknowledge
        const giveawayMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "GIVEAWAY!",
                },
                title: item,
                description: "React to this message with " + this.reactions.join(" or ") + " to participate in the giveaway for a chance to win.",
                footer: {
                    text: winners + " Winners • Ends"
                },
                timestamp: expectedEndDate,
            },
        });

        // create the giveaway
        await GiveawayModel.create({
            _id: giveawayMessage.id,
            channel: giveawayMessage.channel.id,
            guild: giveawayMessage.guild.id,
            winners: winners,
            ends: expectedEndDate,
        });

        // add giveaway reactions
        for (const reaction of this.reactions) {
            await giveawayMessage.react(reaction).catch(() => {
                // this error can be ignored
            });
        }
    }
}
