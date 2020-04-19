/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, EmbedFieldData } from "discord.js";

import * as emojis from "../../utils/emojis";
import TriggerModel from "../../models/Trigger";

export = class MessageFilterCommand extends Command {
    constructor() {
        super("triggers", {
            description: "It allows you to add (and remove) Triggers in the server. When a trigger is set, and Bastion sees a message from a human containing the pattern specified in the trigger, it'll respond with either the specified response message or reaction, or both.",
            triggers: [],
            arguments: {
                alias: {
                    clear: [ "c" ],
                    pattern: [ "p" ],
                    reaction: [ "e" ],
                },
                boolean: [ "clear" ],
                array: [ "pattern" ],
                string: [ "pattern", "reaction" ],
            },
            scope: "guild",
            owner: true,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "triggers",
                "triggers --pattern PATTERN -- RESPONSE",
                "triggers --pattern PATTERN --reaction EMOJI",
                "triggers --clear",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.clear) {
            // clear all the triggers
            await TriggerModel.deleteMany({ guild: message.guild.id });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "info", "triggersClear", message.author.tag),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        if (argv.pattern && argv.pattern.length && (argv._.length || argv.reaction)) {
            // trigger pattern
            const pattern = argv.pattern.join(" ");

            const fields: EmbedFieldData[] = [
                {
                    name: "Trigger",
                    value: pattern,
                    inline: true,
                },
            ];

            // trigger response message
            let response: string;
            if (argv._.length) {
                response = argv._.join(" ");

                fields.push({
                    name: "Response Message",
                    value: response,
                });
            }

            // trigger response reaction
            let reaction: string;
            if (argv.reaction) {
                const emoji = emojis.parseEmoji(argv.reaction);

                if (emoji) {
                    reaction = emoji.value;

                    fields.push({
                        name: "Response Reaction",
                        value: argv.reaction,
                    });
                }
            }

            // create the trigger
            await TriggerModel.create({
                guild: message.guild.id,
                trigger: pattern,
                responseMessage: response,
                responseReaction: reaction,
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "triggersAdd", message.author.tag),
                    fields,
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // get all the triggers
        const triggers = await TriggerModel.find({ guild: message.guild.id });

        // acknowledge
        return await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: this.client.locale.getString("en_us", "info", "triggersList"),
                fields: triggers.map(t => ({
                    name: t.trigger,
                    value: (t.responseMessage ? "Message Response" : "") + "\n" + (t.responseReaction ? "Reaction Response" : ""),
                })),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
