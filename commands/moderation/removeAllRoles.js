/**
 * @file removeAllRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.id) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await Bastion.utils.fetchMember(message.guild, args.id);
    if (user) {
      user = user.user;
    }
  }
  if (!user) {
    user = message.author;
  }

  let member = await Bastion.utils.fetchMember(message.guild, user.id);
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Bastion.log.info(Bastion.i18n.error(message.guild.language, 'lowerRole'));

  await member.removeRoles(member.roles);

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, 'removeAllRoles', message.author.tag, user.tag)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  Bastion.emit('moderationLog', message, this.help.name, user);
};

exports.config = {
  aliases: [ 'removeallr' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'removeAllRoles',
  description: 'Removes all the roles from the specified user of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'removeAllRoles [ @USER_MENTION | USER_ID ]',
  example: [ 'removeAllRoles @user#0001', 'removeAllRoles 282424753565461211', 'removeAllRoles' ]
};
