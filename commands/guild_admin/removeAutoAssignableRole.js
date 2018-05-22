/**
 * @file removeAutoAssignableRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let index = parseInt(args[0]);
    if (!index || index <= 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    index -= 1;

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'autoAssignableRoles' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.autoAssignableRoles) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notSet', 'auto-assignable roles'), message.channel);
    }

    let roles = guildModel.dataValues.autoAssignableRoles;

    if (index >= roles.length) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'indexRange'), message.channel);
    }

    let deletedRoleID = roles[parseInt(args[0]) - 1];
    roles.splice(parseInt(args[0]) - 1, 1);

    await Bastion.database.models.guild.update({
      autoAssignableRoles: roles
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'autoAssignableRoles' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from auto assignable roles.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'raar' ],
  enabled: true
};

exports.help = {
  name: 'removeAutoAssignableRole',
  description: 'Deletes a role from the list of auto-assignable roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeAutoAssignableRole <index>',
  example: [ 'removeAutoAssignableRole 3' ]
};
