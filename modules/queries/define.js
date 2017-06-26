/**
 * @file define command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const wd = require('word-definition');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
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
  description: string('define', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'define [language_code] <word>',
  example: [ 'define Colonel', 'define de Soldat', 'define en Warrior', 'define fr Guerre' ]
};
