/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";

interface Weather {
    coord?: {
        lat: number;
        lon: number;
    };
    weather?: {
        main: string;
        icon: string;
    }[];
    main?: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    wind?: {
        speed: number;
        deg: number;
    };
    clouds?: {
        all: number;
    };
    rain?: {
        "1h": number;
        "3h": number;
    };
    snow?: {
        "1h": number;
        "3h": number;
    };
    visibility?: number;
    dt?: number;
    sys?: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone?: number;
    name?: string;
    cod?: number;
    message?: string;
}

class WeatherCommand extends Command {
    constructor() {
        super({
            name: "weather",
            description: "Displays the weather forcast of the specified location.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "location",
                    description: "The location for the weather forcast.",
                    required: true,
                },
            ],
        });
    }

    private getTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    };

    private kelvinToCelcius = (kelvin: number): number => Math.round(kelvin - 273.15);

    private kelvinToFahrenheit = (kelvin: number): number => Math.round(kelvin * 1.8 - 459.67);

    private degreesToDirection = (degrees: number): string => {
        const directions = [ "North", "North - North East", "North East", "East - North East", "East", "East - South East", "South East", "South -South East", "South", "South - South West", "South West", "West - South West", "West", "West - North West", "North West", "North - North West" ];
        return directions[Math.round((degrees / 22.5 ) + .5) % 8];
    };

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const location = interaction.options.getString("location");

        // fetch current weather
        const { body } = await requests.get(`https://api.openweathermap.org/data/2.5/weather?q=${ encodeURIComponent(location) }&APPID=${ ((interaction.client as Client).settings as Settings)?.get("openWeatherMapApiKey") }`);
        const weather: Weather = await body.json();

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    title: weather.name + (weather.sys.country ? ", " + weather.sys.country : ""),
                    fields: [
                        {
                            name: "Condition",
                            value: weather.weather[0].main,
                            inline: true,
                        },
                        {
                            name: "Cloudiness",
                            value: `${ weather.clouds ? weather.clouds.all : 0 }%`,
                            inline: true,
                        },
                        {
                            name: "Humidity",
                            value: `${ weather.main.humidity ? weather.main.humidity : 0 }%`,
                            inline: true,
                        },
                        {
                            name: "Temperature",
                            value: this.kelvinToCelcius(weather.main.temp) + "°C / "
                                + this.kelvinToFahrenheit(weather.main.temp) + "°F",
                            inline: true,
                        },
                        {
                            name: "Low",
                            value: this.kelvinToCelcius(weather.main.temp_min) + "°C / "
                                + this.kelvinToFahrenheit(weather.main.temp_min) + "°F",
                            inline: true,
                        },
                        {
                            name: "High",
                            value: this.kelvinToCelcius(weather.main.temp_max) + "°C / "
                                + this.kelvinToFahrenheit(weather.main.temp_max) + "°F",
                            inline: true,
                        },
                        {
                            name: "Feels Like",
                            value: this.kelvinToCelcius(weather.main.feels_like) + "°C / "
                                + this.kelvinToFahrenheit(weather.main.feels_like) + "°F",
                            inline: true,
                        },
                        {
                            name: "Wind",
                            value: `${ weather.wind.speed } m/s\n${ this.degreesToDirection(weather.wind.deg || 0) }`,
                            inline: true,
                        },
                        {
                            name: "Pressure",
                            value: `${ weather.main.pressure } hPa (Sea Level)`,
                            inline: true,
                        },
                        {
                            name: "Visibility",
                            value: `${ weather.visibility ? weather.visibility : 0 }m`,
                            inline: true,
                        },
                        {
                            name: "Sunrise",
                            value: weather.sys.sunrise ? this.getTime(new Date(weather.sys.sunrise * 1000)) : "-",
                            inline: true,
                        },
                        {
                            name: "Sunset",
                            value: weather.sys.sunset ? this.getTime(new Date(weather.sys.sunset * 1000)) : "-",
                            inline: true,
                        },
                    ],
                    thumbnail: {
                        url: "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png",
                    },
                    footer: {
                        text: "Powered by OpenWeatherMap",
                    },
                    timestamp: new Date(weather.dt * 1000).toISOString(),
                },
            ],
        });
    }
}

export { WeatherCommand as Command };
