/**
 * @file reminder command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const moment = xrequire('moment');
const remindUsers = {};

exports.exec = (Bastion, message, args) => {
  if (args.cancel) {
    Bastion.clearTimeout(remindUsers[message.author.id]);
    delete remindUsers[message.author.id];

    return message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.i18n.info(message.guild.language, 'deleteReminder', message.author.tag)
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
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'isReminderInUse', 'reminder --cancel'), message.channel);
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
      description: Bastion.i18n.info(message.guild.language, 'addReminder', message.author.tag, args.message.join(' '), moment.duration(duration).humanize())
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
  description: 'Bastion sets a reminder to remind you of specified message, via direct message, after a specified duration.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reminder <-d Duration> <Message>',
  example: [ 'reminder -d 10m30s Get back to work.' ]
};
