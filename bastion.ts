/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as tesseract from "tesseract";


tesseract.StructureManager.initialize();

const Bastion = new tesseract.Client({
    partials: [
        "MESSAGE",
        "REACTION",
    ],
});


Bastion.login().then(() => {
    Bastion.log.info("Shard " + Bastion.shard.ids.join(", ") + " - Launched");
}).catch(console.error);
