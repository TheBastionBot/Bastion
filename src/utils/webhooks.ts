/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed } from "discord.js";
import { Client } from "@bastion/tesseract";

import Settings from "./settings.js";

/**
 * Log data.
 * @param data The embed data for the log message.
 */
export const log = async (client: Client, data: APIEmbed) => {
    if ((client.settings as Settings)?.get("bastion")?.webhookId && (client.settings as Settings)?.get("bastion")?.webhookToken) {
        const bastionWebhook = await client.fetchWebhook((client.settings as Settings).get("bastion").webhookId, (client.settings as Settings).get("bastion").webhookToken);

        await bastionWebhook?.send({
            username: client.user?.username,
            embeds: [ data ],
        });
    }
};
