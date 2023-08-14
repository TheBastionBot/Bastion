/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";

interface Pokemon {
    number?: string;
    name?: string;
    description?: string;
    gen?: number;
    starter?: boolean;
    mega?: boolean;
    ultraBeast?: boolean;
    legendary?: boolean;
    mythical?: boolean;
    species?: string;
    types?: string[];
    abilities?: {
        normal: string[];
        hidden: string[];
    };
    eggGroups?: string[];
    gender?: [ number, number ] | [];
    height?: string;
    weight?: string;
    sprite?: string;
    family?: {
        evolutionLine: string[];
    };
}

class PokemonCommand extends Command {
    constructor() {
        super({
            name: "pokemon",
            description: "Searches for information on the specified pokémon.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name (or number) of the Pokémon.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");

        // fetch pokemon
        const { body } = await requests.get(`https://pokeapi.glitch.me/v1/pokemon/${ encodeURIComponent(name) }`);
        const pokemon: Pokemon[] = await body.json() as unknown[];

        if (pokemon?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
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
                ],
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "pokémon",
            query: name,
        }));
    }
}

export { PokemonCommand as Command };
