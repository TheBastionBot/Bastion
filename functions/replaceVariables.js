/**
 * @file replaceVariables
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (text, message) => {
  let vars = {
    '{prefix}': message.client.configurations.prefix[0],
    '{server}': message.guild.name,
    '{server.id}': message.guild.id,
    '{server.region}': message.guild.region,
    '{server.prefix}': message.guild.prefix ? message.guild.prefix[0] : message.client.configurations.prefix[0],
    '{server.channels.size}': message.guild.channels.size,
    '{server.channels.text.size}': message.guild.channels.filter(channel => channel.type === 'text').size,
    '{server.channels.voice.size}': message.guild.channels.filter(channel => channel.type === 'voice').size,
    '{server.roles.size}': message.guild.roles.size,
    '{server.members.size}': message.guild.members.size,
    '{server.users.size}': message.guild.members.filter(member => member.user.bot === false).size,
    '{server.bots.size}': message.guild.members.filter(member => member.user.bot === true).size,
    '{author}': message.author,
    '{author.id}': message.author.id,
    '{author.tag}': message.author.tag,
    '{author.name}': message.author.username,
    '{author.nick}': message.member.displayName,
    '{author.roles.size}': message.member.roles.size,
    '{bot}': message.client.user,
    '{bot.id}': message.client.user.id,
    '{bot.tag}': message.client.user.tag,
    '{bot.name}': message.client.user.username,
    '{bot.nick}': message.guild.me.displayName,
    '{bot.roles.size}': message.guild.me.roles.size
  };

  let variableRegExp = new RegExp(Object.keys(vars).join('|'), 'ig');

  text = text.replace(variableRegExp, matched => vars[matched]);

  return text;
};
