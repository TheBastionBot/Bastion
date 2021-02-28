/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { GuildMember, Message } from "discord.js";

export const replaceMemberVariables = (string: string, member: GuildMember): string => {
    const vars: { [key: string]: string | number } = {
        "{server}": member.guild.name,
        "{server.id}": member.guild.id,
        "{server.region}": member.guild.region,
        "{server.icon}": member.guild.icon ? member.guild.iconURL({ dynamic: true, size: 512 }) : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(member.guild.nameAcronym)}`,
        "{server.channels.size}": member.guild.channels.cache.size,
        "{server.channels.text.size}": member.guild.channels.cache.filter(channel => channel.type === "text").size,
        "{server.channels.voice.size}": member.guild.channels.cache.filter(channel => channel.type === "voice").size,
        "{server.roles.size}": member.guild.roles.cache.size,
        "{server.members.size}": member.guild.memberCount,
        "{server.users.size}": member.guild.members.cache.filter(member => member.user.bot === false).size,
        "{server.bots.size}": member.guild.members.cache.filter(member => member.user.bot === true).size,
        "{author}": "<@" +  member.id + ">",
        "{author.id}": member.id,
        "{author.tag}": member.user.tag,
        "{author.name}": member.user.username,
        "{author.nick}": member.displayName,
        "{author.avatar}": member.user.displayAvatarURL({ dynamic: true, size: 512 }),
        "{author.roles.size}": member.roles.cache.size,
        "{bot}": "<@" + member.client.user.id + ">",
        "{bot.id}": member.client.user.id,
        "{bot.tag}": member.client.user.tag,
        "{bot.name}": member.client.user.username,
        "{bot.nick}": member.guild.me.displayName,
        "{bot.avatar}": member.guild.me.user.displayAvatarURL({ dynamic: true, size: 512 }),
        "{bot.roles.size}": member.guild.me.roles.cache.size
    };

    const variableRegExp = new RegExp(Object.keys(vars).join("|"), "ig");

    string = string.replace(variableRegExp, matched => vars[matched] as string);

    return string;
};

export const replaceMessageVariables = (string: string, message: Message): string => {
    const vars: { [key: string]: string | number } = {
        "{id}": message.id,
        "{content}": message.content,
        "{content.clean}": message.cleanContent,
        "{server}": message.guild.name,
        "{server.id}": message.guild.id,
        "{server.region}": message.guild.region,
        "{server.icon}": message.guild.icon ? message.guild.iconURL({ dynamic: true, size: 512 }) : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(message.guild.nameAcronym)}`,
        "{server.channels.size}": message.guild.channels.cache.size,
        "{server.channels.text.size}": message.guild.channels.cache.filter(channel => channel.type === "text").size,
        "{server.channels.voice.size}": message.guild.channels.cache.filter(channel => channel.type === "voice").size,
        "{server.roles.size}": message.guild.roles.cache.size,
        "{server.members.size}": message.guild.memberCount,
        "{server.users.size}": message.guild.members.cache.filter(member => member.user.bot === false).size,
        "{server.bots.size}": message.guild.members.cache.filter(member => member.user.bot === true).size,
        "{author}": "<@" +  message.author.id + ">",
        "{author.id}": message.author.id,
        "{author.tag}": message.author.tag,
        "{author.name}": message.author.username,
        "{author.nick}": message.member.displayName,
        "{author.avatar}": message.author.displayAvatarURL({ dynamic: true, size: 512 }),
        "{author.roles.size}": message.member.roles.cache.size,
        "{bot}": "<@" + message.client.user + ">",
        "{bot.id}": message.client.user.id,
        "{bot.tag}": message.client.user.tag,
        "{bot.name}": message.client.user.username,
        "{bot.nick}": message.guild.me.displayName,
        "{bot.avatar}": message.guild.me.user.displayAvatarURL({ dynamic: true, size: 512 }),
        "{bot.roles.size}": message.guild.me.roles.cache.size
    };

    const variableRegExp = new RegExp(Object.keys(vars).join("|"), "ig");

    string = string.replace(variableRegExp, matched => vars[matched] as string);

    return string;
};
