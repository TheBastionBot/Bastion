/**
 * @file removeAutoAssignableRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }
  index -= 1;

  try {
    let guildSettings = await Bastion.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.autoAssignableRoles) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', string('notFound', 'errors'), string('notSet', 'errorMessage', 'auto-assignable roles'), message.channel);
    }

    let roles = guildSettings.autoAssignableRoles.split(' ');

    if (index >= roles.length) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', string('notFound', 'errors'), string('indexRange', 'errorMessage'), message.channel);
    }

    let deletedRoleID = roles[parseInt(args[0]) - 1];
    roles.splice(parseInt(args[0]) - 1, 1);

    await Bastion.db.run(`UPDATE guildSettings SET autoAssignableRoles='${roles.join(' ')}' WHERE guildID=${message.guild.id}`);

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
  name: 'removeautoassignablerole',
  description: string('removeAutoAssignableRole', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeAutoAssignableRole <index>',
  example: [ 'removeAutoAssignableRole 3' ]
};
