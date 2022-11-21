/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import { COLORS } from "../utils/constants";

class StatusCommand extends Command {
    constructor() {
        super({
            name: "status",
            description: "Displays Bastion's status. You can also see Discord's status.",
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "shard",
                    description: "Displays the status of the current shard.",
                },
                // {
                //     type: ApplicationCommandOptionType.Boolean,
                //     name: "discord",
                //     description: "Displays the status of the Discord.",
                // },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const onlyShard = interaction.options.getBoolean("shard");
        // const discord = interaction.options.getBoolean("discord");

        // calculate Bastion's presence
        const guildCounts = await interaction.client.shard.broadcastEval(bastion => bastion.guilds.cache.size);
        const guildCount = onlyShard ? interaction.client.guilds.cache.size : guildCounts.reduce((acc, val) => acc + val, 0);

        const userCounts = await interaction.client.shard.broadcastEval(bastion => bastion.users.cache.size);
        const userCount = onlyShard ? interaction.client.users.cache.size : userCounts.reduce((acc, val) => acc + val, 0);

        // calculate memory usage
        const rss = await interaction.client.shard.broadcastEval(() => process.memoryUsage().rss);
        const memoryUsage = onlyShard ? process.memoryUsage().rss : rss.reduce((acc, val) => acc + val, 0);

        // get uptime
        const uptimes = await interaction.client.shard.broadcastEval(bastion => bastion.uptime);
        const uptime = onlyShard ? interaction.client.uptime : Math.max(...uptimes);

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: `Bastion v${ process.env.npm_package_version }`,
                        url: (interaction.client as Client).locales.getConstant("bastion.website"),
                    },
                    title: `${ onlyShard ? `Shard ${ interaction.client.shard.ids.join(" / ") }` : "" } Status`,
                    url: (interaction.client as Client).locales.getConstant("bastion.website") + "/status",
                    thumbnail: {
                        url: interaction.client.user.displayAvatarURL(),
                    },
                    fields: [
                        {
                            name: "Developer",
                            value: `[**${ (interaction.client as Client).locales.getConstant("author.username") }**](${ (interaction.client as Client).locales.getConstant("author.url") })`,
                            inline: true,
                        },
                        {
                            name: "Bot ID",
                            value: interaction.client.user.id,
                            inline: true,
                        },
                        {
                            name: "Bot Owners",
                            value: (interaction.client as Client).settings?.owners?.join("\n") || "-",
                            inline: true,
                        },
                        {
                            name: "Shards",
                            value: interaction.client.shard.count.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Presence",
                            value: guildCount.toLocaleString() + " Servers\n" + userCount.toLocaleString() + " Users",
                            inline: true,
                        },
                        {
                            name: "Uptime",
                            value: `${ (uptime / 1000).toFixed() }s`,
                            inline: true,
                        },
                        {
                            name: "Memory Usage",
                            value: `${ (memoryUsage / 1024 / 1024).toFixed(2) } MB`,
                            inline: true,
                        },
                        {
                            name: "Environment",
                            value: `Node ${ process.version } on ${ process.platform } ${ process.arch }`,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: `Shard ${ interaction.client.shard.ids.join(" / ") } • ${ interaction.client.ws.ping }ms`,
                    },
                },
            ],
        });
    }
}

export = StatusCommand;
