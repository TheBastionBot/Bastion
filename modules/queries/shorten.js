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

const request = require('request');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = encodeURI(args.join(' '));
  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i.test(args)) {
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.red,
      description: 'Invalid URL'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let options = {
    uri: `https://www.googleapis.com/urlshortener/v1/url?key=${Bastion.credentials.googleAPIkey}`,
    method: 'POST',
    json: {
      "longUrl": args
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      return message.channel.sendMessage('', {embed: {
        color: Bastion.colors.red,
        description: 'Some error has occured, please try again later.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    if (response.statusCode == 200) {
      message.channel.sendMessage('', {embed: {
        color: Bastion.colors.blue,
        fields: [
          {
            name: 'Long URL',
            value: args
          },
          {
            name: 'Short URL',
            value: body.id
          }
        ],
        footer: {
          text: 'Powered by Google'
        }
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      message.channel.sendMessage('', {embed: {
        color: Bastion.colors.red,
        title: `ERROR ${response.body.error.code}`,
        description: response.body.error.message
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'shorten',
  description: 'Shortens a specified URL using Google URL Shortner.',
  botPermission: '',
  permission: '',
  usage: 'shorten <URL>',
  example: ['shorten https://bastion.js.org/SomeLongURL']
};
