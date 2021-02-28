/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Message, User } from "discord.js";
import { Constants } from "@bastion/tesseract";

export default async (message: Message, text?: string): Promise<boolean> => {
    const question = await message.channel.send({
        embed: {
            color: Constants.COLORS.IRIS,
            description: text,
        },
    });

    await question.react("☑️");
    await question.react("🚫");

    const reactions = await question.awaitReactions(
        (reaction, user: User) => user.id === message.author.id && (reaction.emoji.name === "☑️" || reaction.emoji.name === "🚫"),
        {
            max: 1,
            time: 6e4,
        }
    );

    let confirmation: boolean;

    // got the confirmations
    if (reactions.size && reactions.first().emoji.name === "☑️") confirmation = true;

    // didn't get the confirmation
    if (reactions.size && reactions.first().emoji.name === "🚫") confirmation = false;

    // grey out the question
    await question.edit({
        embed: {
            color: Constants.COLORS.SOMEWHAT_DARK,
            description: text,
        },
    }).catch(() => {
        // this error can be ignored
    });

    return confirmation;
};
