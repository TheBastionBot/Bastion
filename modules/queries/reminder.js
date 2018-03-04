/**
 * @file reminder command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const moment = require('moment');
const remindUsers = {};

exports.exec = (Bastion, message, args) => {
  if (args.cancel) {
    Bastion.clearTimeout(remindUsers[message.author.id]);
    delete remindUsers[message.author.id];

    return message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'deleteReminder', message.author.tag)
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  if (!args.duration || !args.message) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let duration = moment.duration(`PT${args.duration.toUpperCase()}`).asMilliseconds(),
    maxDelay = 24 * 60 * 60 * 1000, minDelay = 60 * 1000;

  if (duration > maxDelay || duration < minDelay) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (remindUsers.hasOwnProperty(message.author.id)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isReminderInUse', true, 'reminder --cancel'), message.channel);
  }

  remindUsers[message.author.id] = Bastion.setTimeout(async () => {
    try {
      let authorDMChannel = await message.author.createDM();
      await authorDMChannel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Reminder',
          description: args.message.join(' '),
          timestamp: new Date()
        }
      });

      delete remindUsers[message.author.id];
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }, duration);

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'Reminder Set',
      description: Bastion.strings.info(message.guild.language, 'addReminder', message.author.tag, args.message.join(' '), moment.duration(duration).humanize())
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'remind' ],
  enabled: true,
  argsDefinitions: [
    { name: 'message', type: String, alias: 'm', multiple: true, defaultOption: true },
    { name: 'duration', type: String, alias: 'd' },
    { name: 'cancel', type: Boolean, alias: 'c' }
  ]
};

exports.help = {
  name: 'reminder',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reminder <-d Duration> <Message>',
  example: [ 'reminder -d 10m30s Get back to work.' ]
};
