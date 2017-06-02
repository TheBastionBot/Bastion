/**
 * @file iAm command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (args.length < 1) {
    /**
     * The command was run with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row) return;

    let role = message.guild.roles.find('name', args.join(' '));
    if (role === null) return;
    let selfAssignableRoles = JSON.parse(row.selfAssignableRoles);
    if (!selfAssignableRoles.includes(role.id)) return;
    if (message.guild.me.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('I don\'t have permission to use this command on that role.');

    message.guild.members.get(message.author.id).addRole(role).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${message.author}, you have been given **${role.name}** role.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'iwant', 'ihave' ],
  enabled: true
};

exports.help = {
  name: 'iam',
  description: 'Adds a specified self assignable role to the user.',
  botPermission: 'MANAGE_ROLES',
  userPermission: '',
  usage: 'iAm <role name>',
  example: [ 'iAm Looking to play' ]
};
