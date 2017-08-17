/**
 * @file textUnMute command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.channel.permissionsFor(message.member).has(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(string('lowerRole', 'errorMessage'));

  let permissionOverwrites = message.channel.permissionOverwrites.get(user.id);
  if (permissionOverwrites) {
    try {
      await permissionOverwrites.delete();

      let reason = args.slice(1).join(' ');
      if (reason.length < 1) {
        reason = 'No reason given';
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Text unmuted',
          fields: [
            {
              name: 'User',
              value: user.tag,
              inline: true
            },
            {
              name: 'ID',
              value: user.id,
              inline: true
            },
            {
              name: 'Reason',
              value: reason,
              inline: false
            }
          ]
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
      * Logs moderation events if it is enabled
      * @fires moderationLog
      */
      Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason, {
        channel: message.channel
      });
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
};

exports.config = {
  aliases: [ 'tum' ],
  enabled: true
};

exports.help = {
  name: 'textunmute',
  description: string('textUnMute', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'textUnMute @user-mention [Reason]',
  example: [ 'textUnMute @user#0001 Reason for the unmute.' ]
};
