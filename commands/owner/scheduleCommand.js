/**
 * @file scheduleCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
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
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', '`cron` expression'), message.channel);
  }
  for (let i = 0; i < cronExpLength; i++) {
    if (!cronConstraints[i].test(args.cronExp[i])) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', '`cron` expression'), message.channel);
    }
  }

  if (!Bastion.commands.has(args.command) && !Bastion.aliases.has(args.command)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
  }

  args.cronExp = args.cronExp.join(' ');
  args.arguments = args.arguments.join(' ');

  try {
    let scheduledStatus = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Scheduled Command',
        description: `\`\`\`${args.cronExp} ${args.command} ${args.arguments}\`\`\``,
        footer: {
          text: 'Do not delete this message, it is required by me to run the scheduled command.'
        }
      }
    });

    await Bastion.database.models.scheduledCommand.create({
      guildID: message.guild.id,
      channelID: message.channel.id,
      messageID: scheduledStatus.id,
      cronExp: args.cronExp,
      command: args.command,
      arguments: args.arguments
    },
    {
      fields: [ 'guildID', 'channelID', 'messageID', 'cronExp', 'command', 'arguments' ]
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'schedcmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'cronExp', type: String, multiple: true, defaultOption: true },
    { name: 'command', type: String, alias: 'c' },
    { name: 'arguments', type: String, alias: 'a', multiple: true, defaultValue: '' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'scheduleCommand',
  description: 'Schedule a command as cron jobs to run at the specified schedule.\n`cron` expression format:```Second         0-59 or * or range\nMinute         0-59 or * or range\nHour           0-23 or * or range\nDay of month   1-31 or * or range\nMonth          1-12 or * or range\nDay of week    0-7 (0 or 7 is SUN) or * or range```',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'scheduleCommand <CRON PATTERN> <-c COMMAND> [-a ARGUMENTS]',
  example: [ 'scheduleCommand 0 0 0 1 1 * -c echo -a Happy New Year!' ]
};
