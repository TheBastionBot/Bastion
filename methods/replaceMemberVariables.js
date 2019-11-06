/**
 * @file replaceMemberVariables
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (text, member) => {
  let vars = {
    '{prefix}': member.client.configurations.prefix[0],
    '{server}': member.guild.name,
    '{server.id}': member.guild.id,
    '{server.region}': member.guild.region,
    '{server.icon}': member.guild.icon ? member.guild.iconURL : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(member.guild.nameAcronym)}`,
    '{server.prefix}': member.guild.prefix ? member.guild.prefix[0] : member.client.configurations.prefix[0],
    '{server.channels.size}': member.guild.channels.size,
    '{server.channels.text.size}': member.guild.channels.filter(channel => channel.type === 'text').size,
    '{server.channels.voice.size}': member.guild.channels.filter(channel => channel.type === 'voice').size,
    '{server.roles.size}': member.guild.roles.size,
    '{server.members.size}': member.guild.memberCount,
    '{server.users.size}': member.guild.members.filter(member => member.user.bot === false).size,
    '{server.bots.size}': member.guild.members.filter(member => member.user.bot === true).size,
    '{author}': member.user,
    '{author.id}': member.user.id,
    '{author.tag}': member.user.tag,
    '{author.name}': member.user.username,
    '{author.nick}': member.displayName,
    '{author.avatar}': member.user.displayAvatarURL,
    '{author.roles.size}': member.roles.size,
    '{bot}': member.client.user,
    '{bot.id}': member.client.user.id,
    '{bot.tag}': member.client.user.tag,
    '{bot.name}': member.client.user.username,
    '{bot.nick}': member.guild.me.displayName,
    '{bot.avatar}': member.guild.me.user.displayAvatarURL,
    '{bot.roles.size}': member.guild.me.roles.size
  };

  let variableRegExp = new RegExp(Object.keys(vars).join('|'), 'ig');

  text = text.replace(variableRegExp, matched => vars[matched]);

  return text;
};
