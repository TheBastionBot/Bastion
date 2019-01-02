/**
 * @file deafen command
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

  await member.setDeaf(true);

  args.reason = args.reason.join(' ');

  await message.channel.send({
    embed: {
      color: Bastion.colors.ORANGE,
      description: Bastion.i18n.info(message.guild.language, 'deafen', message.author.tag, user.tag, args.reason)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  Bastion.emit('moderationLog', message, this.help.name, user, args.reason);
};

exports.config = {
  aliases: [ 'deaf' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'deafen',
  description: 'Deafens a specified user server-wide in your Discord server.',
  botPermission: 'DEAFEN_MEMBERS',
  userTextPermission: 'DEAFEN_MEMBERS',
  userVoicePermission: '',
  usage: 'deafen <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'deafen @user#001 -r Shouting like crazy', 'deafen 167147569575323761 -r Profanity' ]
};
