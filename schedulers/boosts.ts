/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Logger, Scheduler } from "@bastion/tesseract";

import ConfigModel from "../models/Config";
import GuildModel from "../models/Guild";

export = class Boosts extends Scheduler {
    constructor() {
        super("boosts", {
            // every day
            cronTime: "0 0 0 * * *",
        });
    }

    exec = async (): Promise<void> => {
        try {
            const config = await ConfigModel.findById(this.client.user.id);

            const month = new Date().getMonth();

            // check whether boosts have been reset this month
            if (month === config.boostResetMonth) return;

            // reset boosts
            await GuildModel.updateMany({}, {
                $unset: {
                    boosts: 1,
                },
            });

            // update boost reset month
            config.boostResetMonth = month;

            // save document
            await config.save();
        } catch (e) {
            Logger.error(e);
        }
    }
}
