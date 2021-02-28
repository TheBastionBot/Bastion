/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import fetch from "node-fetch";

import * as errors from "../../utils/errors";

export = class PokemonCommand extends Command {
    constructor() {
        super("pokemon", {
            description: "It allows you to search for information on the specified Pokémon.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "pokemon NAME",
                "pokemon NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the pokemon to search
        const identifier = argv._.join(" ");

        // fetch the pokemon
        const response = await fetch("https://pokeapi.glitch.me/v1/pokemon/" + encodeURIComponent(identifier));
        const pokemon = await response.json();

        // check for errors
        if (pokemon.error) throw new Error(pokemon.message);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: (pokemon[0].mythical ? "Mythical " : "") + (pokemon[0].legendary ? "Legendary " : "") + (pokemon[0].mega ? "Mega" : "") + (pokemon[0].ultraBeast ? "Ultra Beast" : "") + (pokemon[0].starter ? "Starter " : "") + "Pokémon",
                },
                title: pokemon[0].name,
                description: "Discovered in generation " + pokemon[0].gen,
                fields: [
                    {
                        name: "Number",
                        value: pokemon[0].number,
                        inline: true,
                    },
                    {
                        name: "Species",
                        value: pokemon[0].species,
                        inline: true,
                    },
                    {
                        name: "Types",
                        value: pokemon[0].types.join("\n"),
                        inline: true,
                    },
                    {
                        name: "Abilities",
                        value: `Normal: ${pokemon[0].abilities.normal.join(", ") || "-"}\nHidden: ${pokemon[0].abilities.hidden.join(", ") || "-"}`,
                        inline: true,
                    },
                    {
                        name: "Egg Groups",
                        value: pokemon[0].eggGroups.join("\n"),
                        inline: true,
                    },
                    {
                        name: "Gender Ratio",
                        value: pokemon[0].gender.length ? `${pokemon[0].gender[0]}:${pokemon[0].gender[1]}` : "Genderless",
                        inline: true,
                    },
                    {
                        name: "Height",
                        value: pokemon[0].height,
                        inline: true,
                    },
                    {
                        name: "Weight",
                        value: pokemon[0].weight,
                        inline: true,
                    },
                    {
                        name: "Evolution Line",
                        value: pokemon[0].family.evolutionLine.join(" -> "),
                    },
                    {
                        name: "Description",
                        value: pokemon[0].description,
                    },
                ],
                thumbnail: {
                    url: pokemon[0].sprite,
                },
                footer: {
                    text: "Powered by PokéDex API",
                },
            },
        });
    }
}
