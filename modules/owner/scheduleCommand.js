/**
 * @file scheduleCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.cronExp || !args.command) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let cronExpLength = 6, cronConstraints = [];
  cronConstraints[0] = new RegExp(/^[0-5]?\d|\*|[0-5]?\d(?:,[0-5]?\d){1,59}$/);
  cronConstraints[1] = cronConstraints[0];
  cronConstraints[2] = new RegExp(/^(?:[01]?\d|2[0-3])|\*|(?:[01]?\d|2[0-3])(?:,(?:[01]?\d|2[0-3])){1,23}$/);
  cronConstraints[3] = new RegExp(/^(?:0?[1-9]|[12]\d|3[01])|\*|(?:0?[1-9]|[12]\d|3[01])(?:,(?:0?[1-9]|[12]\d|3[01])){1,30}$/);
  cronConstraints[4] = new RegExp(/^(?:0?[1-9]|1[0-2])|\*|(?:[1-9]|1[0-2])(?:,(?:[1-9]|1[0-2])){1,11}$/);
  cronConstraints[5] = new RegExp(/^[0-7]|\*|[0-7](?:,[0-7]){1,6}$/);

  if (args.cronExp.length !== cronExpLength) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('invalidInput', 'errorMessage', '`cron` expression'), message.channel);
  }
  for (let i = 0; i < cronExpLength; i++) {
    if (!cronConstraints[i].test(args.cronExp[i])) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('invalidInput', 'errors'), string('invalidInput', 'errorMessage', '`cron` expression'), message.channel);
    }
  }

  if (!Bastion.commands.has(args.command) && !Bastion.aliases.has(args.command)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'command'), message.channel);
  }

  args.cronExp = args.cronExp.join(' ');
  args.arguments = args.arguments.join(' ');

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Scheduled Command',
      description: `\`\`\`${args.cronExp} ${args.command} ${args.arguments}\`\`\``,
      footer: {
        text: 'Do not delete this message, as it is required by me run the scheduled command.'
      }
    }
  }).then(msg => {
    Bastion.db.run('INSERT INTO scheduledCommands (cronExp, channelID, messageID, command, arguments) VALUES (?, ?, ?, ?, ?)',
      [
        args.cronExp,
        message.channel.id,
        msg.id,
        args.command,
        args.arguments
      ]).catch(e => {
        Bastion.log.error(e);
      });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'schedcmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'cronExp', type: String, multiple: true, defaultOption: true },
    { name: 'command', type: String, alias: 'c' },
    { name: 'arguments', type: String, alias: 'a', multiple: true, defaultValue: '' }
  ]
};

exports.help = {
  name: 'schedulecommand',
  description: string('scheduleCommand', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'scheduleCommand <CRON PATTERN> <-c COMMAND> [-a ARGUMENTS]',
  example: [ 'scheduleCommand 0 0 0 1 1 * -c echo -a Happy New Year!' ]
};
