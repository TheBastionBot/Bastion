/**
 * @file selfDestruct command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.content) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let minTimeout = 5, maxTimeout = 600;
    if (args.timeout < minTimeout || args.timeout > maxTimeout) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'selfDestructTimeout', minTimeout, maxTimeout), message.channel);
    }

    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e);
      });
    }

    let secretMessage = await message.channel.send({
      embed: {
        color: Bastion.colors.DEFAULT,
        description: args.content.join(' '),
        footer: {
          text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from Bastion or from its creators.'}`
        }
      }
    });
    await secretMessage.delete(args.timeout * 1000);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'destruct' ],
  enabled: true,
  argsDefinitions: [
    { name: 'content', type: String, alias: 'c', multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 30 }
  ]
};

exports.help = {
  name: 'selfDestruct',
  description: 'Sends the same message that you had sent, but it will get auto deleted after a specific amount of time.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'selfDestruct <content> [-t <seconds>]',
  example: [ 'selfDestruct This will destruct after 30 seconds', 'selfDestruct This will destruct after 10 seconds -t 10' ]
};
