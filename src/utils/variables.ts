/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, Message, PartialGuildMember } from "discord.js";

export const replace = (string: string, context: PartialGuildMember | GuildMember | Message): string => {
    const vars: { [key: string]: string | number } = {
        "{id}": context?.id,
        "{content}": context instanceof Message ? context?.content : "",
        "{content.clean}": context instanceof Message ? context?.cleanContent : "",
        "{server}": context?.guild.name,
        "{server.id}": context?.guild.id,
        "{server.icon}": context?.guild.icon ? context?.guild.iconURL() : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(context?.guild.nameAcronym)}`,
        "{server.channels.size}": context?.guild.channels.cache.size,
        "{server.roles.size}": context?.guild.roles.cache.size,
        "{server.members.size}": context?.guild.memberCount,
        "{server.users.size}": context?.guild.members.cache.filter(context => context?.user.bot === false).size,
        "{server.bots.size}": context?.guild.members.cache.filter(context => context?.user.bot === true).size,
        "{author}": "<@" +  context?.id + ">",
        "{author.id}": context?.id,
        "{author.tag}": context instanceof Message ? context?.author.id : context?.user.tag,
        "{author.name}": context instanceof Message ? context?.author.username : context?.user.username,
        "{author.nick}": context instanceof Message ?  context?.member.displayName : context?.displayName,
        "{author.avatar}": context instanceof Message ? context?.author.displayAvatarURL() : context?.user.displayAvatarURL(),
        "{author.roles.size}": context instanceof Message ? context?.member.roles.cache.size : context?.roles.cache.size,
        "{bot}": "<@" + context?.client.user.id + ">",
        "{bot.id}": context?.client.user.id,
        "{bot.tag}": context?.client.user.tag,
        "{bot.name}": context?.client.user.username,
        "{bot.nick}": context?.guild.members.me.displayName,
        "{bot.avatar}": context?.guild.members.me.user.displayAvatarURL(),
        "{bot.roles.size}": context?.guild.members.me.roles.cache.size,
    };

    const variableRegExp = new RegExp(Object.keys(vars).join("|"), "ig");

    string = string.replace(variableRegExp, matched => vars[matched] as string);

    return string;
};
