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
  let channel = message.mentions.channels.first();
  if (!channel) {
    if (/^[0-9]{18}$/.test(args[0])) {
      channel = message.guild.channels.get(args[0]);
    }
    else channel = message.channel;
  }

  if (channel) {
    let title;
    if (channel.type === 'text') {
      title = 'Text Channel Info';
    }
    else {
      title = 'Voice Channel Info';
    }
    message.channel.send({embed: {
      color: Bastion.colors.blue,
      title: title,
      fields: [
        {
          name: 'Name',
          value: channel.name,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        },
        {
          name: 'Topic',
          value: (channel.topic === null || channel.topic.length < 2) ? '-' : channel.topic,
          inline: false
        },
        {
          name: 'Created At',
          value: channel.createdAt.toUTCString(),
          inline: true
        },
        {
          name: 'Users',
          value: channel.members.size,
          inline: true
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `No channel found with ID: **${args[0]}**`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['cinfo'],
  enabled: true
};

exports.help = {
  name: 'channelinfo',
  description: 'Shows information about the mentioned channel. If no channel is mentioned, shows information about the current channel.',
  botPermission: '',
  userPermission: '',
  usage: 'channelInfo [#channel-mention | CHANNEL_ID]',
  example: ['channelInfo #channel-name', 'channelInfo 221133445599667788', 'channelInfo']
};
