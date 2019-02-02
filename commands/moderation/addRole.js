/**
 * @file addRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  let role;
  if (!user) {
    user = message.author;
    role = args.join(' ');
  }
  else {
    role = args.slice(1).join(' ');
  }
  role = message.guild.roles.find(r => r.name === role);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info(Bastion.i18n.error(message.guild.language, 'lowerRole'));
  else if (!role) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let member = await Bastion.utils.fetchMember(message.guild, user.id);
  member.addRole(role);

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: Bastion.i18n.info(message.guild.language, 'addRole', message.author.tag, role.name, user.tag)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  let reason = 'No reason given';

  Bastion.emit('moderationLog', message, this.help.name, user, reason, {
    role: role
  });
};

exports.config = {
  aliases: [ 'addr' ],
  enabled: true
};

exports.help = {
  name: 'addRole',
  description: 'Adds the specified role to a specified user of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'addRole [@user-mention] <Role Name>',
  example: [ 'addRole @user#001 Role Name', 'addRole Role Name' ]
};
