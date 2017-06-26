/**
 * @file removeRole command
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

  let user = message.mentions.users.first();
  let role;
  if (!user) {
    user = message.author;
    role = args.join(' ');
  }
  else {
    role = args.slice(1).join(' ');
  }
  role = message.guild.roles.find('name', role);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Not Found', 'No role was found for the given parameter.', message.channel);
  }

  message.guild.members.get(user.id).removeRole(role).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'Role Removed',
        description: `${user.tag} has now been removed from **${role.name}** role.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    let reason = 'No reason given';

    /**
     * Logs moderation events if it is enabled
     * @fires moderationLog
     */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason, {
      role: role
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'remover' ],
  enabled: true
};

exports.help = {
  name: 'removerole',
  description: string('removeRole', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'removeRole [@user-mention] <Role Name>',
  example: [ 'removeRole @user#0001 Role Name', 'removeRole Role Name' ]
};
