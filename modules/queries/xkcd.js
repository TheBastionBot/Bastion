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

const xkcd = require('xkcd');
const getRandomInt = require('../../functions/getRandomInt');

exports.run = function(Bastion, message, args) {
  let num = parseInt(args[0]);
  if (args[0] != undefined && !isNaN(num)) {
    xkcd(function (data) {
      xkcd(num > data.num ? data.num : num, function (data) {
        message.channel.sendMessage('', {embed: {
          color: 6651610,
          title: data.title,
          description: data.alt,
          url: `https://xkcd.com/${data.num}`,
          fields: [
            {
              name: 'Comic Number',
              value: data.num,
              inline: true
            },
            {
              name: 'Publication Date',
              value: new Date(data.year, data.month, data.day).toDateString(),
              inline: true
            }
          ],
          image: {
            url: data.img
          },
          footer: {
            text: 'Powered by xkcd',
            icon_url: 'https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_1024x1024.png?v=1479786341'
          }
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      });
    });
  }
  else if (args[0] != undefined && args[0].toLowerCase() == 'latest') {
    xkcd(function (data) {
      message.channel.sendMessage('', {embed: {
        color: 6651610,
        title: data.title,
        description: data.alt,
        url: `https://xkcd.com/${data.num}`,
        fields: [
          {
            name: 'Comic Number',
            value: data.num,
            inline: true
          },
          {
            name: 'Publication Date',
            value: new Date(data.year, data.month, data.day).toDateString(),
            inline: true
          }
        ],
        image: {
          url: data.img
        },
        footer: {
          text: 'Powered by xkcd',
          icon_url: 'https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_1024x1024.png?v=1479786341'
        }
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    });
  }
  else {
    xkcd(function (data) {
      let num = getRandomInt(1, data.num);
      xkcd(num, function (data) {
        message.channel.sendMessage('', {embed: {
          color: 6651610,
          title: data.title,
          description: data.alt,
          url: `https://xkcd.com/${data.num}`,
          fields: [
            {
              name: 'Comic Number',
              value: data.num,
              inline: true
            },
            {
              name: 'Publication Date',
              value: new Date(data.year, data.month, data.day).toDateString(),
              inline: true
            }
          ],
          image: {
            url: data.img
          },
          footer: {
            text: 'Powered by xkcd',
            icon_url: 'https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_1024x1024.png?v=1479786341'
          }
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      });
    });
  }
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'xkcd',
  description: 'Shows a **xkcd** comic. No arguments will shows a random comic. If a comic number is given, it will show that specific comic & \'latest\' will show the latest comic.',
  permission: '',
  usage: 'xkcd [latest|comic_number]',
  example: ['xkcd', 'xkcd latest', 'xkcd 834']
};
