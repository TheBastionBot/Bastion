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
    title: 'Channel Topic',
    description: (channel.topic == null || channel.topic.length < 1) ? 'No channel topic set' : channel.topic
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['ct']
};

exports.help = {
  name: 'channeltopic',
  description: 'Returns a mentioned channel\'s topic. Or current channle\'s topic, if no channel is mentioned.',
  permission: '',
  usage: 'channelTopic [#channel-mention]',
  example: ['channelTopic #channel-name', 'channelTopic']
};
