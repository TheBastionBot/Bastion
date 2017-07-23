/**
 * @file renameRole command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!args.old || !args.new) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let maxLength = 100;
  args.old = args.old.join(' ');
  args.new = args.new.join(' ');
  if (args.new.length > maxLength) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('roleNameLength', 'errorMessage', maxLength), message.channel);
  }


  let role = message.guild.roles.find('name', args.old);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), string('roleNotFound', 'errorMessage'), message.channel);
  }

  try {
    await role.setName(args.new);
    await message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Role Renamed',
        fields: [
          {
            name: 'From',
            value: args.old,
            inline: true
          },
          {
            name: 'To',
            value: args.new,
            inline: true
          }
        ]
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'renamer' ],
  enabled: true,
  argsDefinitions: [
    { name: 'old', type: String, alias: 'o', multiple: true },
    { name: 'new', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'renamerole',
  description: string('renameRole', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'renameRole < -o Old Role Name -n New Role Name >',
  example: [ 'renameRole -o Server Staffs -n Legendary Staffs' ]
};
