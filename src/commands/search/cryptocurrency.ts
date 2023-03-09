/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";

interface Currency {
    name: string;
    symbol: string;
    description: string;
    logo: string;
    date_added: string;
}

interface CurrencyResponse {
    status: {
        error_code: number;
        error_message: string;
    };
    data: {
        [key: string]: Currency;
    };
}

class CryptoCurrencyCommand extends Command {
    constructor() {
        super({
            name: "cryptocurrency",
            description: "Searches for information on the specified crypto currency.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "symbol",
                    description: "The symbol of the crypto currency.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const symbol = interaction.options.getString("symbol");

        // fetch crypto currency
        const { body } = await requests.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=" + encodeURIComponent(symbol), {
            "X-CMC_PRO_API_KEY": ((interaction.client as Client).settings as Settings)?.get("coinMarketCapApiKey"),
        });
        const response: CurrencyResponse = await body.json();
        const currency = Object.values(response?.data || {})[0];

        if (response?.status?.error_code === 0 && currency) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: currency.name + " (" + currency.symbol + ")",
                        description: currency.description,
                        thumbnail: {
                            url: currency.logo,
                        },
                        footer: {
                            text: "Powered by CoinMarketCap",
                        },
                        timestamp: new Date(currency.date_added).toISOString(),
                    },
                ],
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "cryptocurrency",
            query: symbol,
        }));
    }
}

export { CryptoCurrencyCommand as Command };
