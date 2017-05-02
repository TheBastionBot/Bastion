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

  urllib.request(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info|pageimages&exsentences=10&exintro=true&explaintext=true&inprop=url&pithumbsize=512&redirects=1&formatversion=2&titles=${args.join(' ')}`, function (err, data) {
    try {
      data = JSON.parse(data).query.pages[0];
    } catch (e) {
      return Bastion.log.error(e.stack);
    }
    let embed = {};
    if (data.missing) {
      embed = {embed: {
        color: Bastion.colors.red,
        description: `**${args.join(' ')}** was not found in Wikipedia.`
      }};
    }
    else {
      embed = {embed: {
        color: Bastion.colors.blue,
        title: data.title,
        url: data.fullurl,
        description: `${data.extract}\n[Read More](${data.fullurl})`,
        thumbnail: {
          url: data.thumbnail ? data.thumbnail.source : `https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png`
        },
        footer: {
          text: 'Powered by Wikipedia'
        }
      }};
    }
    message.channel.send(embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['wiki']
};

exports.help = {
  name: 'wikipedia',
  description: 'Searches Wikipedia and shows the result.',
  botPermission: '',
  permission: '',
  usage: 'wikipedia <text>',
  example: ['wikipedia Steve Jobs']
};
