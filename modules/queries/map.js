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
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.join(' ').split('--zoom');
  for (let i = 0; i < args.length; i++) {
    args[i] = args[i].trim();
  }
  args[1] = args[1] && args[1] >= 0 && args[1] <= 20 ? args[1] : 13;

  request({url: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(args[0])}&zoom=${args[1]}&size=600x300&maptype=roadmap%20&markers=color:blue|${encodeURIComponent(args[0])}&key=${Bastion.credentials.googleAPIkey}`, encoding: null}, function (err, res, body) {
    if (err) {
      Bastion.log.error(err);
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'Some error has occured, please check the console.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({ files: [body] }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'map',
  description: 'Get the map of the specified location. It takes an optional `--zoom` argument which takes an zoom amount from value 0 to 20.',
  botPermission: '',
  userPermission: '',
  usage: 'map <location> [--zoom <amount>]',
  example: ['map New York, NY', 'map London Eye, London --zoom 18']
};
