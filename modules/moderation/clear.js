/**
 * @file clear command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
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

  let user = message.mentions.users.first();
  let limit = parseInt(args[0]) ? args[0] : args[1];
  let amount;
  if (user || args.includes('--bots')) {
    amount = 100;
  }
  else {
    amount = /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100;
  }

  message.channel.fetchMessages({
    limit: amount
  }).then(msgs => {
    msgs = msgs.filter(m => message.createdTimestamp - m.createdTimestamp < 1209600000);
    if (user) {
      msgs = msgs.filter(m => m.author.id === user.id).array().slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    else if (args.includes('--bots')) {
      msgs = msgs.filter(m => m.author.bot).array().slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    if (args.includes('--nonpinned')) {
      msgs = msgs.filter(m => !m.pinned);
    }
    if (msgs.size < 2 || msgs.length < 2) {
      let error;
      if ((msgs.size === 1 || msgs.length === 1) && (user || args.includes('--bots'))) {
        error = 'Dude, you can delete a single message by yourself, right? You don\'t need me for that!';
      }
      else {
        error = 'No messages found that could be deleted.';
      }

      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', error, message.channel);
    }
    message.channel.bulkDelete(msgs).then(() => {
      let reason = 'No reason given';

      /**
       * Logs moderation events if it is enabled
       * @fires moderationLog
       */
      Bastion.emit('moderationLog', message.guild, message.author, this.help.name, message.channel, reason, {
        cleared: `${msgs.size || msgs.length}${args.includes('--nonpinned') ? ' non pinned' : ''} messages from ${user ? user : args.includes('--bots') ? 'BOTs' : 'everyone'}`
      });

    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'clr' ],
  enabled: true
};

exports.help = {
  name: 'clear',
  description: 'Delete a bulk of messages from a channel specified by an user and/or number. If no user is specified, delete everyone\'s messages. If no amount is specified, it defaults to 100 messages. Using `--bots` flag clears messages from bots in that channel. Using `--nonpinned` flag clears messages that aren\'t pinned.',
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'MANAGE_MESSAGES',
  usage: 'clear [@user-mention | --bots] [no_of_messages]',
  example: [ 'clear 50', 'clear @user#0001 5', 'clear --bots 10', 'clear' ]
};
