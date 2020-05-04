/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class WeatherCommand extends Command {
    constructor() {
        super("weather", {
            description: "It allows you to see the current weather forcast of the specified location.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "weather LOCATION",
            ],
        });
    }

    private getTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    }

    private kelvinToCelcius = (kelvin: number): number => Math.round(kelvin - 273.15);

    private kelvinToFahrenheit = (kelvin: number): number => Math.round(kelvin * 1.8 - 459.67);

    private degreesToDirection = (degrees: number): string => {
        const directions = [ "North", "North - North East", "North East", "East - North East", "East", "East - South East", "South East", "South -South East", "South", "South - South West", "South West", "West - South West", "West", "West - North West", "North West", "North - North West" ];
        return directions[Math.round((degrees / 22.5 ) + .5) % 8];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        // identify the city
        const city = argv._.join(" ");

        const response = await omnic.makeRequest("/weather/" + city);
        const weather: {
            coord: {
                lat: number;
                lon: number;
            };
            weather: {
                main: string;
                icon: string;
            }[];
            main: {
                temp: number;
                feels_like: number;
                temp_min: number;
                temp_max: number;
                pressure: number;
                humidity: number;
                sea_level: number;
                grnd_level: number;
            };
            wind: {
                speed: number;
                deg: number;
            };
            clouds: {
                all: number;
            };
            rain: {
                "1h": number;
                "3h": number;
            };
            snow: {
                "1h": number;
                "3h": number;
            };
            visibility: number;
            dt: number;
            sys: {
                country: string;
                sunrise: number;
                sunset: number;
            };
            timezone: number;
            name: string;
            cod: number;
            message?: string;
        } = await response.json();

        // check for errors
        if (weather.cod !== 200) throw new Error(weather.message);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Weather",
                },
                title: weather.name + (weather.sys.country ? ", " + weather.sys.country : ""),
                fields: [
                    {
                        name: "Condition",
                        value: weather.weather[0].main,
                        inline: true,
                    },
                    {
                        name: "Coordinates",
                        value: weather.coord.lat + ", " + weather.coord.lon,
                        inline: true,
                    },
                    {
                        name: "Time Zone",
                        value: "UTC" + (weather.timezone < 0 ? "" : "+") + (weather.timezone / 60 / 60),
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
                        name: "Humidity",
                        value: weather.main.humidity + "%",
                        inline: true,
                    },
                    {
                        name: "Pressure",
                        value: weather.main.pressure + " hPa (Sea Level)\n"
                            + (weather.main.grnd_level ? weather.main.grnd_level : "-") + " hPa (Ground Level)",
                        inline: true,
                    },
                    {
                        name: "Wind",
                        value: weather.wind.speed + " m/s\n"
                            + (weather.wind.deg ? this.degreesToDirection(weather.wind.deg) : weather.wind.deg),
                        inline: true,
                    },
                    {
                        name: "Cloudiness",
                        value: (weather.clouds ? weather.clouds.all : 0) + "%",
                        inline: true,
                    },
                    {
                        name: "Precipitation",
                        value: (weather.rain ? weather.rain["1h"] : "-") + " cm (Rain)\n"
                            + (weather.snow ? weather.snow["1h"] : "-") + " cm (Snow)\n",
                        inline: true,
                    },
                    {
                        name: "Visibility",
                        value: (weather.visibility ? weather.visibility : "-") + " m",
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
                timestamp: new Date(weather.dt * 1000),
            },
        });
    }
}
