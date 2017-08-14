/**
 * @file warn command
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
  if (!message.guild.members.get(user.id).kickable) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('forbidden', 'errors'), `I don't have permissions to warn ${user}.`, message.channel);
  }

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No given reason';
  }

  if (!message.guild.warns) {
    message.guild.warns = {};
  }
  if (!message.guild.warns.hasOwnProperty(user.id)) {
    message.guild.warns[user.id] = 1;
  }
  else {
    if (message.guild.warns[user.id] === 2) {
      try {
        let member = await message.guild.members.get(user.id).kick('Warned 3 times!');

        delete message.guild.warns[user.id];
        message.channel.send({
          embed: {
            color: Bastion.colors.orange,
            title: 'Kicked',
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
                value: 'Warned 3 times!',
                inline: false
              }
            ]
          }
        }).catch(e => {
          Bastion.log.error(e);
        });

        Bastion.emit('moderationLog', message.guild, message.author, 'kick', user, 'Warned 3 times!');

        member.send({
          embed: {
            color: Bastion.colors.orange,
            title: `Kicked from ${message.guild.name} Server`,
            fields: [
              {
                name: 'Reason',
                value: 'You have been warned 3 times!'
              }
            ]
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      catch (e) {
        Bastion.log.error(e);
      }
    }
    else {
      message.guild.warns[user.id] += 1;
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.orange,
      title: 'Warning',
      description: `${user} have been warned by ${message.author} for **${reason}**.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });

  user.send({
    embed: {
      color: Bastion.colors.orange,
      title: 'Warning',
      description: 'You have been warned!',
      fields: [
        {
          name: 'Reason',
          value: reason
        },
        {
          name: 'Server',
          value: message.guild.name
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
};

exports.config = {
  aliases: [ 'w' ],
  enabled: true
};

exports.help = {
  name: 'warn',
  description: string('warn', 'commandDescription'),
  botPermission: 'KICK_MEMBERS',
  userPermission: 'KICK_MEMBERS',
  usage: 'warn @user-mention [Reason]',
  example: [ 'warn @user#0001 Reason for the warning.' ]
};
