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

exports.run = function(Bastion, message, args) {
  if (!(channel = message.mentions.channels.first())) channel = message.channel;

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'Channel Info',
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
        value: (channel.topic == null || channel.topic.length < 1) ? '-' : channel.topic,
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
  }});
};

exports.conf = {
  aliases: ['cinfo']
};

exports.help = {
  name: 'channelinfo',
  description: 'Shows information about the mentioned channel. If no channel is mentioned, shows information about the current channel.',
  permission: '',
  usage: ['channelInfo #channel-name', 'channelinfo']
};
