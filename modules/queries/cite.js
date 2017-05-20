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

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^[0-9]{18}$/.test(args[0])) {
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

  message.channel.fetchMessage(args[0]).then(msg => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL
        },
        description: msg.content,
        timestamp: msg.createdAt
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    if (e.stack.includes('Unknown Message')) {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No message was found with the specified Message ID in this channel.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      Bastion.log.error(e.stack);
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cite',
  description: 'Cites a users message, specified by the message ID, in the channel.',
  botPermission: '',
  userPermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: ['cite 221133446677558899']
};
