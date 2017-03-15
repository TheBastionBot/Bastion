/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const wd = require('word-definition');

exports.run = function(Bastion, message, args) {
  if (args.length < 1) return;
  for (let i = 0; i < args.length - 1; i++)
    args[i] = args[i].toLowerCase();
  if (!/^(en|fr|de)$/.test(lang=args[0])) {
    lang = 'en';
    args = args.join(' ');
  }
  else args = args.slice(1).join(' ');
  wd.getDef(args, lang, null, function(data) {
    let embed = {};
    if (data.err) {
      embed = {embed: {
        color: 13380644,
        description: `No definition found for **${data.word}** in **${lang.toUpperCase()}** Dictionary.`
      }};
    }
    else {
      embed = {embed: {
        color: 6651610,
        title: data.word,
        description: `*${data.category}*\n\n${data.definition}`,
        footer: {
          icon_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Wiktionary_logo_Diego_UFCG.png',
          text: 'Powered by Wiktionary'
        }
      }};
    }
    message.channel.sendMessage('', embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.conf = {
  aliases: ['meaning']
};

exports.help = {
  name: 'define',
  description: 'Searches the definition of a word from English, French or German dictionary (specified in the message; if no language is specified, defaults to English).',
  permission: '',
  usage: 'define [language_code] <word>',
  example: ['define Colonel', 'define de Soldat', 'define en Warrior', 'define fr Guerre']
};
