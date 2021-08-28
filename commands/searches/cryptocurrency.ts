/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";
import { BastionCredentials } from "../../typings/settings";

interface Currency {
    name: string;
    symbol: string;
    description: string;
    logo: string;
    date_added: string;
}

export = class CryptocurrencyCommand extends Command {
    constructor() {
        super("cryptocurrency", {
            description: "It allows you to see some information on the specified cryptocurrency.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "cryptocurrency SYMBOL",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the cryptocurrency symbol
        const symbol = argv._.join(" ");

        // fetch data on the cryptocurrency
        const response = await requests.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=" + encodeURIComponent(symbol), {
            "X-CMC_PRO_API_KEY": (this.client.credentials as BastionCredentials).coinMarketCapApiKey,
        });
        const { status, data }: {
            status: { error_code: number; error_message: string };
            data: { [key: string]: Currency };
        } = await response.json();

        // check for errors
        if (status.error_code !== 0) throw new Error(status.error_message);

        const currency: Currency = Object.values(data)[0];

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Cryptocurrency",
                },
                title: currency.name + " (" + currency.symbol + ")",
                description: currency.description,
                thumbnail: {
                    url: currency.logo,
                },
                footer: {
                    text: "Powered by CoinMarketCap • Added",
                },
                timestamp: new Date(currency.date_added),
            },
        });
    }
}
