/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed } from "discord.js";
import { Client } from "@bastion/tesseract";

import { bastion } from "../types.js";

/**
 * Log data.
 * @param data The embed data for the log message.
 */
export const log = async (client: Client, data: APIEmbed) => {
    if ((client.settings as bastion.Settings)?.bastion?.webhookId && (client.settings as bastion.Settings)?.bastion?.webhookToken) {
        const bastionWebhook = await client.fetchWebhook((client.settings as bastion.Settings).bastion.webhookId, (client.settings as bastion.Settings).bastion.webhookToken);

        await bastionWebhook?.send({
            username: "Bastion",
            embeds: [ data ],
        });
    }
};
