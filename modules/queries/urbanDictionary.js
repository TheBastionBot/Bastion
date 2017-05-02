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

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  urllib.request(`https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`, function (err, data) {
    try {
      data = JSON.parse(data).list;
    } catch (e) {
      return Bastion.log.error(e.stack);
    }
    let embed = {};
    if (data.length != 0) {
      embed = {embed: {
        color: Bastion.colors.blue,
        title: data[0].word,
        url: `http://www.urbandictionary.com/define.php?term=${data[0].word}`,
        description: data[0].definition,
        footer: {
          text: 'Powered by Urban Dictionary'
        }
      }};
    }
    else {
      embed = {embed: {
        color: Bastion.colors.red,
        description: `No definition found for the term **${args.join(' ')}**`,
      }};
    }

    message.channel.send(embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['ud']
};

exports.help = {
  name: 'urbandictionary',
  description: 'Searches Urban Dictionary for a urban definition of word.',
  botPermission: '',
  permission: '',
  usage: 'urbanDictionary <word>',
  example: ['urbanDictionary pineapple']
};
