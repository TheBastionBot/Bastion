/*!
 * @author TRACTION (iamtraction)
 * @copyright 2021 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as requests from "../../utils/requests";
import { BastionCredentials } from "../../typings/settings";

export = class WordOfTheDayCommand extends Command {
    constructor() {
        super("wotd", {
            description: "It shows you the word of the day.",
            triggers: [ "wod", "wordOfTheDay" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // fetch word of the day
        const response = await requests.get("https://api.wordnik.com/v4/word.json/wordOfTheDay?api_key=" + (this.client.credentials as BastionCredentials).wordnikApiKey);
        const wotd = await response.json();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Word of the Day",
                },
                title: wotd.word,
                fields: wotd.definitions.filter((definition: { text: string }) => definition.text).slice(0, 5).map((definition: { text: string; partOfSpeech: string }, i: number) => ({
                    name: (i + 1) + ". " + (definition.partOfSpeech || ""),
                    value: definition.text.slice(0, 1024),
                })),
                footer: {
                    text: "Powered by Century Dictionary, the American Heritage Dictionary, and Wiktionary.",
                },
            },
        });
    };
}
