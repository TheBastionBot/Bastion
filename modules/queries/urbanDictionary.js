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

const urllib = require('urllib');

exports.run = function(Bastion, message, args) {
  if (args.length < 1) return;

  urllib.request(`https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`, function (err, data) {
    try {
      data = JSON.parse(data).list;
    } catch (e) {
      return Bastion.log.error(e.stack);
    }
    let embed = {};
    if (data.length != 0) {
      embed = {embed: {
        color: 6651610,
        title: data[0].word,
        url: `http://www.urbandictionary.com/define.php?term=${data[0].word}`,
        description: data[0].definition,
        footer: {
          icon_url: 'https://pbs.twimg.com/profile_images/1164168434/ud_profile2_400x400.jpg',
          text: 'Powered by Urban Dictionary'
        }
      }};
    }
    else {
      embed = {embed: {
        color: 13380644,
        description: `No definition found for the term **${args.join(' ')}**`,
      }};
    }

    message.channel.sendMessage('', embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.conf = {
  aliases: ['ud']
};

exports.help = {
  name: 'urbandictionary',
  description: 'Searches Urban Dictionary for a urban definition of word.',
  permission: '',
  usage: 'urbanDictionary <word>',
  example: ['urbanDictionary pineapple']
};
