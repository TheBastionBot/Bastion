/**
 * @file softBan command
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

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');

  if (!message.guild.members.get(user.id).bannable) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('forbidden', 'errors'), `I don't have permissions to softban ${user}.`, message.channel);
  }

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No reason given';
  }

  message.guild.members.get(user.id).ban({
    days: 7,
    reason: reason
  }).catch(e => {
    Bastion.log.error(e);
  });
  message.guild.unban(user.id).then(user => {
    message.channel.send({
      embed: {
        color: Bastion.colors.orange,
        title: 'Soft-Banned',
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
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, user, reason);

    user.send({
      embed: {
        color: Bastion.colors.orange,
        title: `Soft-Banned from ${message.guild.name} Server`,
        description: `**Reason:** ${reason}`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'Soft-Ban Error',
        description: 'Banned but unable to unban. Please unban the following user.',
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
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'sb' ],
  enabled: true
};

exports.help = {
  name: 'softban',
  description: string('softBan', 'commandDescription'),
  botPermission: 'BAN_MEMBERS',
  userPermission: 'BAN_MEMBERS',
  usage: 'softBan @user-mention [Reason]',
  example: [ 'softBan @user#0001 Reason for soft ban.' ]
};
