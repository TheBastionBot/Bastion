/**
 * @file translate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const translate = require('google-translate-api');

exports.run = (Bastion, message, args) => {
  if (args.length < 2) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
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
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    if (e.stack.includes('not supported')) {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `The language **${args[0].toUpperCase()}** is not supported.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  });
};

exports.config = {
  aliases: [ 'trans' ],
  enabled: true
};

exports.help = {
  name: 'translate',
  description: 'Translates your message to a language specified in the arguments by the language code.',
  botPermission: '',
  userPermission: '',
  usage: 'translate <language_code> <text>',
  example: [ 'translate EN Je suis génial!' ]
};
