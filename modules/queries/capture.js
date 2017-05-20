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

const capture = require('webshot');

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
  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args[0])) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Invalid URL'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let options = {
    windowSize: {
      width: 1366,
      height: 768
    },
    shotSize: {
      width: 'all',
      height: 'all'
    },
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
  };
  capture(args[0], options, function (err, renderStream) {
    if (err) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `Bastion can't find the server at **${args[0]}**.\n• Check the address for typing errors such as **ww**.example.com instead of **www**.example.com\n• Connection may've been timed out, try again later.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    let imageBuffers = [];
    renderStream.on('data', function (data) {
      imageBuffers.push(data);
    });
    renderStream.on('end', function () {
      let imageBuffer = Buffer.concat(imageBuffers);
      if (imageBuffer.length > 0) {
        message.channel.send({
          file: {
            attachment: imageBuffer,
            name: 'capture.jpg'
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    });
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'capture',
  description: 'Captures and sends a screenshot of a specified webpage.',
  botPermission: '',
  userPermission: '',
  usage: 'capture <url>',
  example: ['capture bastion.js.org']
};
