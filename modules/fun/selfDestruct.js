/**
 * @file selfDestruct command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!args.content) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let minTimeout = 5, maxTimeout = 600;
  if (args.timeout < 5 || args.timeout > 600) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('outOfRange', 'errorMessage', 'Timeout', minTimeout, maxTimeout), message.channel);
  }

  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e);
    });
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.grey,
      description: args.content.join(' ')
    }
  }).then(msg => {
    msg.delete(args.timeout * 1000);
  }).catch(e => {
    Bastion.log.error(e);
  });
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
  name: 'selfdestruct',
  description: string('selfDestruct', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'selfDestruct <content> [-t <seconds>]',
  example: [ 'selfDestruct This will destruct after 30 seconds', 'selfDestruct This will destruct after 10 seconds -t 10' ]
};
