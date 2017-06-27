/**
 * @file removeSelfAssignableRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
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

  Bastion.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.selfAssignableRoles === '[]') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', string('notFound', 'errors'), 'No self assignable roles found.', message.channel);
    }
    else {
      let roles = JSON.parse(row.selfAssignableRoles);
      if (index >= roles.length) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('notFound', 'errors'), 'That index was not found.', message.channel);
      }
      let deletedRoleID = roles[parseInt(args[0]) - 1];
      roles.splice(parseInt(args[0]) - 1, 1);
      Bastion.db.run(`UPDATE guildSettings SET selfAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'rsar' ],
  enabled: true
};

exports.help = {
  name: 'removeselfassignablerole',
  description: string('removeSelfAssignableRole', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeSelfAssignableRole <index>',
  example: [ 'removeSelfAssignableRole 3' ]
};
