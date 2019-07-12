/**
 * @file removeSelfAssignableRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    return Bastion.emit('commandUsage', message, this.help);
  }
  index -= 1;

  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'selfAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.selfAssignableRoles) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notSet', 'self-assignable roles'), message.channel);
  }
  let roles = guildModel.dataValues.selfAssignableRoles;

  if (index >= roles.length) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'indexRange'), message.channel);
  }

  let deletedRoleID = roles[parseInt(args[0]) - 1];
  roles.splice(parseInt(args[0]) - 1, 1);

  await Bastion.database.models.guild.update({
    selfAssignableRoles: roles.length ? roles : null
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'selfAssignableRoles' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'rsar' ],
  enabled: true
};

exports.help = {
  name: 'removeSelfAssignableRole',
  description: 'Deletes a role from the list of self-assignable roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeSelfAssignableRole <index>',
  example: [ 'removeSelfAssignableRole 3' ]
};
