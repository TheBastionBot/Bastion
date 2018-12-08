/**
 * @file ban command
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

  if (message.guild.members.has(user.id)) {
    let member = await message.guild.members.get(user.id);
    if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.i18n.error(message.guild.language, 'lowerRole'));

    if (!member.bannable) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noPermission', 'ban', user), message.channel);
    }
  }

  args.reason = args.reason.join(' ');

  await message.guild.ban(user.id, {
    days: 7,
    reason: args.reason
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, 'ban', message.author.tag, user.tag, args.reason),
      footer: {
        text: `ID ${user.id}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  Bastion.emit('moderationLog', message, this.help.name, user, args.reason);

  let DMChannel = await user.createDM();
  await DMChannel.send({
    embed: {
      color: Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, 'banDM', message.author.tag, message.guild.name, args.reason)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'b' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'ban',
  description: 'Bans the specified user from your Discord server and removes 7 days of their message history.',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'ban <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'ban @user#001 -r Spamming in support channel.', 'ban 167147569575323761 -r Reputed spammer.' ]
};
