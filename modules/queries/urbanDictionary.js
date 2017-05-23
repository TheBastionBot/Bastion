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

  request(`https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`, function (err, response, body) {
    let color, description = '', data = [];

    if (err) {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the server. Please try again later.';
    }
    else if (response.statusCode === 200) {
      color = Bastion.colors.blue;
      try {
        body = JSON.parse(body).list[0];

        data = [
          {
            name: 'Word',
            value: body.word || args.join(' ')
          },
          {
            name: 'Definition',
            value: body.definition || '-'
          },
          {
            name: 'Example',
            value: body.example || '-'
          }
        ];
      }
      catch (e) {
        color = Bastion.colors.red;
        description = 'Some error has occured while parsing the received data. Please try again later.';
      }
    }
    else {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the server.';
      data = [
        {
          name: `${response.statusCode}`,
          value: response.statusMessage
        }
      ];
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Urban Dictionary',
        description: description,
        fields: data,
        footer: {
          text: 'Powered by Urban Dictionary'
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'ud' ],
  enabled: true
};

exports.help = {
  name: 'urbandictionary',
  description: 'Searches Urban Dictionary for a urban definition of word.',
  botPermission: '',
  userPermission: '',
  usage: 'urbanDictionary <word>',
  example: [ 'urbanDictionary pineapple' ]
};
