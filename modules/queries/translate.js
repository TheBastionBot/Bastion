/**
 * @file translate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const translate = require('google-translate-api');

exports.run = (Bastion, message, args) => {
  if (args.length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  translate(args.slice(1).join(' '), { to: args[0] }).then(res => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        description: res.text,
        footer: {
          text: `Powered by Google | Translation from ${res.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
    if (e.stack.includes('not supported')) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('invalidInput', 'errors'), `The language **${args[0].toUpperCase()}** is not supported.`, message.channel);
    }
  });
};

exports.config = {
  aliases: [ 'trans' ],
  enabled: true
};

exports.help = {
  name: 'translate',
  description: string('translate', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'translate <language_code> <text>',
  example: [ 'translate EN Je suis génial!' ]
};
