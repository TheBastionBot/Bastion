/**
 * @file define command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const wd = require('word-definition');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
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
  for (let i = 0; i < args.length - 1; i++) {
    args[i] = args[i].toLowerCase();
  }
  let lang = args[0];
  if (!/^(en|fr|de)$/.test(lang)) {
    lang = 'en';
    args = args.join(' ');
  }
  else {
    args = args.slice(1).join(' ');
  }
  wd.getDef(args, lang, null, function(data) {
    let embed = {};
    if (data.err) {
      embed = {
        embed: {
          color: Bastion.colors.red,
          description: `No definition found for **${data.word}** in **${lang.toUpperCase()}** Dictionary.`
        }
      };
    }
    else {
      embed = {
        embed: {
          color: Bastion.colors.blue,
          title: data.word,
          description: `*${data.category}*\n\n${data.definition}`,
          footer: {
            text: 'Powered by Wiktionary'
          }
        }
      };
    }
    message.channel.send(embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'meaning' ],
  enabled: true
};

exports.help = {
  name: 'define',
  description: 'Searches the definition of a word from English, French or German dictionary (specified in the message; if no language is specified, defaults to English).',
  botPermission: '',
  userPermission: '',
  usage: 'define [language_code] <word>',
  example: [ 'define Colonel', 'define de Soldat', 'define en Warrior', 'define fr Guerre' ]
};
