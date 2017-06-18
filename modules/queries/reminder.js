/**
 * @file reminder command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const moment = require('moment');
const remindUsers = {};

exports.run = (Bastion, message, args) => {
  if (args.cancel) {
    Bastion.clearTimeout(remindUsers[message.author.id]);
    delete remindUsers[message.author.id];

    return message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: 'Your reminders have been cancelled.'
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
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'You already have a reminder. You can set only one ' +
                     'reminder at once. Please wait for it to complete or ' +
                     'run `reminder --cancel` to cancel the previous reminder.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  remindUsers[message.author.id] = Bastion.setTimeout(() => {
    Bastion.users.get(message.author.id).send({
      embed: {
        color: Bastion.colors.blue,
        title: 'Reminder',
        description: args.message.join(' '),
        timestamp: new Date()
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    delete remindUsers[message.author.id];
  }, duration);

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'Reminder Set',
      description: `I will remind you to *${args.message.join(' ')}* after *${moment.duration(duration).humanize()}*.`
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
  description: 'Bastion sets a reminder to DM you with a specified message and duration. Duration can\'t exceed 24 hours and can\'t be less than 1 minute.',
  botPermission: '',
  userPermission: '',
  usage: 'reminder <-d Duration> <Message>',
  example: [ 'reminder 10m30s Get back to work.' ]
};
