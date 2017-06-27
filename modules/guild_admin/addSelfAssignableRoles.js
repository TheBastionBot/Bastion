/**
 * @file addSelfAssignableRoles command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  for (let i = 0; i < args.length; i++) {
    if (!(parseInt(args[i]) < 9223372036854775807)) {
      args.splice(args.indexOf(args[i]), 1);
    }
  }
  args = args.filter(r => message.guild.roles.get(r));
  if (args.length < 1) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), 'No role was found for the given parameter.', message.channel);
  }

  Bastion.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let roles = JSON.parse(row.selfAssignableRoles);
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];
    // roles = roles.unique(roles);
    Bastion.db.run(`UPDATE guildSettings SET selfAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
      let roleNames = [];
      for (let i = 0; i < args.length; i++) {
        roleNames.push(message.guild.roles.get(args[i]).name);
      }
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Added self assignable roles',
          description: roleNames.join(', ')
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'asar' ],
  enabled: true
};

exports.help = {
  name: 'addselfassignableroles',
  description: string('addSelfAssignableRoles', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'ADMINISTRATOR',
  usage: 'addSelfAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addSelfAssignableRoles 443322110055998877 778899550011223344' ]
};
