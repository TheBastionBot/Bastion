/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";

import { COLORS } from "../../utils/constants";

class SkipCommand extends Command {
    constructor() {
        super({
            name: "queue",
            description: "Displays the current music queue in the server.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

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
        await interaction.reply({ content: "Nothing is in the queue at the moment.", ephemeral: true });
    }
}

export = SkipCommand;
