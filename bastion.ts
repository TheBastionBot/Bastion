/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as tesseract from "@bastion/tesseract";
import { Intents } from "discord.js";


tesseract.StructureManager.initialize();

const Bastion = new tesseract.Client({
    messageCacheMaxSize: 5,
    messageCacheLifetime: 9e2,
    messageSweepInterval: 36e2,
    partials: [
        "MESSAGE",
        "REACTION",
    ],
    ws: {
        intents: new Intents(Intents.ALL).remove(
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING",
            "GUILD_INTEGRATIONS",
            "GUILD_MESSAGE_TYPING",
            "GUILD_WEBHOOKS",
        ),
    },
});


Bastion.login().then(() => {
    tesseract.Logger.info("Shard " + Bastion.shard.ids.join(", ") + " - Launched");
}).catch(console.error);
