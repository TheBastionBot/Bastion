/**
 * @file kick command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await Bastion.fetchUser(args.id);
  }
  if (!user) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let member = await Bastion.utils.fetchMember(message.guild, user.id);
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.i18n.error(message.guild.language, 'lowerRole'));

  if (!member.kickable) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noPermission', 'kick', user), message.channel);
  }

  await member.kick(args.reason);

  args.reason = args.reason.join(' ');

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, 'kick', message.author.tag, user.tag, args.reason),
      footer: {
        text: `ID ${user.id}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  Bastion.emit('moderationLog', message, this.help.name, member, args.reason);

  await member.send({
    embed: {
      color: Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, 'kickDM', message.author.tag, message.guild.name, args.reason)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'k' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'kick',
  description: 'Kicks the specified user from your Discord server.',
  botPermission: 'KICK_MEMBERS',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'kick <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'kick @user#001 -r Being rude to everyone.', 'kick 167147569575323761 -r Spamming' ]
};
