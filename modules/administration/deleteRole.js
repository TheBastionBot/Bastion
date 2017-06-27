/**
 * @file deleteRole command
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

  if (!args.mention && !args.id && !args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    if (args.id) {
      role = message.guild.roles.get(args.id);
    }
    else if (args.name) {
      role = message.guild.roles.find('name', args.name.join(' '));
    }
  }

  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), 'No role was found for the given parameter.', message.channel);
  }

  role.delete().then(r => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'Role Deleted',
        fields: [
          {
            name: 'Role Name',
            value: r.name,
            inline: true
          },
          {
            name: 'Role ID',
            value: r.id,
            inline: true
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deleter' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', multiple: true, defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deleterole',
  description: string('deleteRole', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'deleteRole < [-m] @Role Mention | -i ROLE_ID | -n Role Name >',
  example: [ 'deleteRole -m @Server Staffs', 'deleteRole -i 295982817647788032', 'deleteRole -n Server Staffs' ]
};
