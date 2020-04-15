/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Message, User } from "discord.js";
import { Constants } from "tesseract";

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

    if (reactions.size && reactions.first().emoji.name === "☑️") return true;
    if (reactions.size && reactions.first().emoji.name === "🚫") return false;
    return null;
};
