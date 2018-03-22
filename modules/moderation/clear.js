/**
 * @file clear command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let user = message.mentions.users.first();
    let limit = parseInt(args[0]) ? args[0] : args[1];
    let amount;
    if (user || args.includes('--bots')) {
      amount = 100;
    }
    else {
      amount = /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100;
    }

    let msgs = await message.channel.fetchMessages({
      limit: amount
    });

    if (user) {
      msgs = Array.from(msgs.filter(m => m.author.id === user.id).values()).slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    else if (args.includes('--bots')) {
      msgs = Array.from(msgs.filter(m => m.author.bot).values()).slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    if (args.includes('--nonpinned')) {
      msgs = msgs.filter(m => !m.pinned);
    }
    if (msgs.size < 2 || msgs.length < 2) {
      let error;
      if ((msgs.size === 1 || msgs.length === 1) && (user || args.includes('--bots'))) {
        error = Bastion.strings.error(message.guild.language, 'singleMessage', true);
      }
      else {
        error = Bastion.strings.error(message.guild.language, 'noDeletableMessage', true);
      }

      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', error, message.channel);
    }

    await message.channel.bulkDelete(msgs, true);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `I've cleared ${msgs.size || msgs.length}${args.includes('--nonpinned') ? ' non pinned' : ''} messages from ${user ? user : args.includes('--bots') ? 'BOTs' : 'everyone'}.`
      }
    }).then(msg => {
      msg.delete(10000).catch(() => {});
    }).catch(e => {
      Bastion.log.error(e);
    });

    let reason = 'No reason given';

    /**
    * Logs moderation events if it is enabled
    * @fires moderationLog
    */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, message.channel, reason, {
      cleared: `${msgs.size || msgs.length}${args.includes('--nonpinned') ? ' non pinned' : ''} messages from ${user ? user : args.includes('--bots') ? 'BOTs' : 'everyone'}`
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'clr', 'purge' ],
  enabled: true
};

exports.help = {
  name: 'clear',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'clear [ @user-mention | --bots ] [--nonpinned] [no_of_messages]',
  example: [ 'clear 50', 'clear @user#0001 5', 'clear --bots 10', 'clear' ]
};
