/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as yaml from "yaml";
import { promises as fs } from "fs";
import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");
import { version } from "../../package.json";

interface ChangeLog {
    date: string;
    image: string;
    changes: {
        [section: string]: {
            title: string;
            description: string;
        }[];
    };
}

export = class ChangeLogCommand extends Command {
    constructor() {
        super("changelog", {
            description: "It allows you to see the changes that have been introduced in the current version of Bastion.",
            triggers: [ "changes" ],
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
        // get the changelog
        const changelog: ChangeLog = yaml.parse(await fs.readFile("./changelog.yaml", "utf-8"));

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: this.client.locale.getConstant("bastion.name"),
                    url: this.client.locale.getConstant("bastion.website"),
                },
                title: "v" + version,
                url: this.client.locale.getConstant("bastion.project.url") + "/Bastion/releases",
                fields: Object.keys(changelog.changes).map(section => ({
                    name: section,
                    value: changelog.changes[section].map(change => (change.title ? "**" + change.title + "**\n" : "") + change.description).join("\n\n"),
                    inline: false,
                })).concat([
                    {
                        name: "Missed an update?",
                        value: "[Check out our previous change logs](" + this.client.locale.getConstant("bastion.project.url") + "/Bastion/releases)."
                          + "\nJoin **" + this.client.locale.getConstant("bastion.server.name") + "** and never miss an update: " + this.client.locale.getConstant("bastion.server.invite"),
                        inline: true,
                    },
                    {
                        name: "Support " + this.client.locale.getConstant("bastion.name") + "'s Development",
                        value: "[Donate to " + this.client.locale.getConstant("bastion.project") + "](" + this.client.locale.getConstant("bastion.website") + "/donate) and get an enhanced Bastion experience!",
                        inline: true,
                    },
                ]),
                image: {
                    url: changelog.image,
                },
                footer: {
                    text: changelog.date + " • " + this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowEarlyReleases"),
                },
            },
        });
    }
}
