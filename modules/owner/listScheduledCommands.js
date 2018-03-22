/**
 * @file listScheduledCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let scheduledCommands = await Bastion.db.all('SELECT cronExp, command, arguments FROM scheduledCommands');

    if (scheduledCommands.length === 0) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'scheduledCommandsNotFound', true), message.channel);
    }

    scheduledCommands = scheduledCommands.map((t, i) => `${i + 1}. \`${t.cronExp} ${t.command} ${t.arguments}\``);

    let noOfPages = scheduledCommands.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'List of Scheduled Commands',
        description: scheduledCommands.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'listschedcmds' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'listScheduledCommands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listScheduledCommands [page_no]',
  example: [ 'listScheduledCommands', 'listScheduledCommands 2' ]
};
