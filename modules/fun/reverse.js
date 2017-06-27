/**
 * @file reverse command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Reversed Text:',
      description: args.join(' ').split('').reverse().join('')
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'rev' ],
  enabled: true
};

exports.help = {
  name: 'reverse',
  description: string('reverse', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'reverse <text>',
  example: [ 'reverse !looc si sihT' ]
};
