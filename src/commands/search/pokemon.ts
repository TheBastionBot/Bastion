/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";

interface Pokemon {
    number?: number;
    name?: string;
    codename?: string;
    gen?: number;
    species?: string;
    types?: string[],
    abilities?: {
        name: string;
        description: string;
        hidden: boolean;
    }[];
    height?: string;
    weight?: string;
    mega?: boolean | {
        stone: string;
        sprite: string;
    };
    baseStats?: {
        hp: number;
        attack: number;
        defense: number;
        spAtk: number;
        spDef: number;
        speed: number;
    };
    training?: {
        evYield: string;
        catchRate: string;
        baseFriendship: string;
        baseExp: string;
        growthRate: string;
    };
    breeding?: {
        gender: string;
        eggGroups: string[];
        eggCycles: string;
    };
    sprite?: string;
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
        const { body } = await requests.get(`https://ex.traction.one/pokedex/pokemon/${ encodeURIComponent(name) }`);
        const pokemon: Pokemon[] = await body.json() as unknown[];

        if (pokemon?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        author: {
                            name: (pokemon[0].codename ? "Ultra Beast" : "") + "Pokémon",
                        },
                        title: pokemon[0].name,
                        description: pokemon[0].species,
                        fields: [
                            {
                                name: "Number",
                                value: "#" + pokemon[0].number?.toString(),
                                inline: true,
                            },
                            {
                                name: "Generation",
                                value: pokemon[0].gen?.toString(),
                                inline: true,
                            },
                            {
                                name: "Types",
                                value: pokemon[0].types.join("\n"),
                                inline: true,
                            },
                            {
                                name: "Abilities",
                                value: pokemon[0].abilities.map(a => a.name).join("\n") || "Undiscovered",
                                inline: true,
                            },
                            {
                                name: "Egg Groups",
                                value: pokemon[0].breeding?.eggGroups.join("\n"),
                                inline: true,
                            },
                            {
                                name: "Gender Ratio",
                                value: pokemon[0].breeding?.gender || "Undiscovered",
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
