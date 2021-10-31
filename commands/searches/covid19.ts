/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as extraction from "../../utils/extraction";

interface GlobalStats {
    data: {
        confirmed: number;
        recovered: number;
        deaths: number;
    };
    ts: number;
}

interface RegionalStats {
    location: string;
    code: string;
    confirmed: number;
    recovered: number;
    deaths: number;
}

export = class COVID19Command extends Command {
    constructor() {
        super("covid19", {
            description: "It allows you to see the latest global and regional stats on COVID-19.",
            triggers: [ "covid", "coronavirus" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "covid19",
                "covid19 REGION",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv._.length) {
            const response = await extraction.makeRequest("/covid19/regions/" + argv._.join(" "));
            const stats: RegionalStats = await response.json();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    author: {
                        name: "COVID-19 Tracker",
                        url: "https://coronavirus.traction.one",
                    },
                    title: "Regional Stats - " + stats.location,
                    url: "https://coronavirus.traction.one/regions/" + stats.code,
                    description: "The first case of the new Coronavirus COVID-19 was recorded on 31 December in Wuhan, China (WHO). Since then, **" + stats.confirmed.toLocaleString() + "** confirmed cases have been recorded in " + stats.location  + ".",
                    fields: [
                        {
                            name: "Confirmed",
                            value: stats.confirmed.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Recoveries",
                            value: stats.recovered.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Deaths",
                            value: stats.deaths.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Active",
                            value: (stats.confirmed - stats.recovered - stats.deaths).toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Case-Recovery %",
                            value: (stats.recovered / stats.confirmed * 100).toFixed(2) + "%",
                            inline: true,
                        },
                        {
                            name: "Case-Fatality %",
                            value: (stats.deaths / stats.confirmed * 100).toFixed(2) + "%",
                            inline: true,
                        },
                        {
                            name: "Get more details",
                            value: "[WHO (World Health Organization)](https://www.who.int/emergencies/diseases/novel-coronavirus-2019)\n\nUse the `" + this.name + " --help` command to see more usage of this command.",
                        },
                    ],
                    footer: {
                        text: "Powered by COVID-19 Tracker",
                    },
                },
            });
        }

        const response = await extraction.makeRequest("/covid19");
        const stats: GlobalStats = await response.json();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.RED,
                author: {
                    name: "COVID-19 Tracker",
                    url: "https://coronavirus.traction.one",
                },
                title: "Global Stats",
                url: "https://coronavirus.traction.one",
                description: "The first case of the new Coronavirus COVID-19 was recorded on 31 December in Wuhan, China (WHO). Since then, **" + stats.data.confirmed.toLocaleString() + "** confirmed cases have been recorded worldwide.",
                fields: [
                    {
                        name: "Confirmed",
                        value: stats.data.confirmed.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Recoveries",
                        value: stats.data.recovered.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Deaths",
                        value: stats.data.deaths.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Active",
                        value: (stats.data.confirmed - stats.data.recovered - stats.data.deaths).toLocaleString(),
                        inline: true,
                    },
                    {
                        name: "Case-Recovery %",
                        value: (stats.data.recovered / stats.data.confirmed * 100).toFixed(2) + "%",
                        inline: true,
                    },
                    {
                        name: "Case-Fatality %",
                        value: (stats.data.deaths / stats.data.confirmed * 100).toFixed(2) + "%",
                        inline: true,
                    },
                    {
                        name: "Get more details",
                        value: "[WHO (World Health Organization)](https://www.who.int/emergencies/diseases/novel-coronavirus-2019)\n\nUse the `" + this.name + " --help` command to see more usage of this command.",
                    },
                ],
                footer: {
                    text: "Powered by COVID-19 Tracker",
                },
                timestamp: new Date(stats.ts),
            },
        });
    };
}
