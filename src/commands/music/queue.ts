/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";

import { COLORS } from "../../utils/constants";

class SkipCommand extends Command {
    constructor() {
        super({
            name: "queue",
            description: "Displays the current music queue in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "remove",
                    description: "Remove songs matching the specified text from the music queue.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "clear",
                    description: "Remove all songs from the music queue.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const remove = interaction.options.getString("remove")?.toLowerCase();
        const clear = interaction.options.getBoolean("clear");

        const studio = (interaction.client as Client).studio.get(interaction.guild);

        // clear the music queue
        if (clear) {
            studio.queue = [];
            return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueClear"));
        }

        // remove the songs from the queue matching the query
        if (remove) {
            studio.queue = studio.queue.filter(s => !s.name.toLowerCase().includes(remove));
            return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueRemove", { query: remove }));
        }

        // show the music queue
        if (studio?.queue?.length) {
            return await interaction.reply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: "Music Queue",
                        description: studio.player?.state?.status !== AudioPlayerStatus.Idle && `Now Playing ${ (studio.player.state.resource?.metadata as music.Song)?.name }.`,
                        fields: studio.queue.slice(0, 10).map((song: music.Song, i) => ({
                            name: `#${ i + 1 } — ${ song.name }`,
                            value: `Requested by ${ song.user }`,
                        })),
                        footer: {
                            text: `${ studio.queue.length } songs in the queue.`
                        },
                    },
                ],
            });
        }

        await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueEmpty"), ephemeral: true });
    }
}

export = SkipCommand;
