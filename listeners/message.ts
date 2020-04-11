/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { ClientApplication, DMChannel, Message, Team, User } from "discord.js";

import ConfigModel from "../models/Config";

export = class MessageListener extends Listener {
    constructor() {
        super("message", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (message: Message): Promise<void> => {
        if (message.channel instanceof DMChannel) {
            const config = await ConfigModel.findById(this.client.user.id);

            if (config.relayDirectMessages && message.content) {
                // get the application owner
                const app: ClientApplication = await this.client.fetchApplication();
                const owner: User = app.owner instanceof Team ? app.owner.owner.user : app.owner;

                const channel: DMChannel = await owner.createDM();

                // relay the message to the application owner
                await channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        author: {
                            name: message.author.tag
                        },
                        description: message.content,
                        footer: {
                            text: message.author.id,
                        },
                    },
                });
            }
        }
    }
}
