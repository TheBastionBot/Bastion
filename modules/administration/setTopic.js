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
  if (!(channel = message.mentions.channels.first())) channel = message.channel;
  if (!channel.permissionsFor(message.author).hasPermission("MANAGE_CHANNELS")) return Bastion.log.info('You don\'t have permissions to use this command.');

  topic = args.join(' ');
  if (topic.length < 1) {
    topic = ' ';
    title = 'Channel Topic Removed';
  }
  else {
    title = 'Channel Topic Set';
  }

  channel.setTopic(topic).then(() => {
    message.channel.sendMessage('', {embed: {
      color: 5088314,
      title: title,
      description: topic
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['st']
};

exports.help = {
  name: 'settopic',
  description: 'Sets the topic of the mentioned channel with a given name. If no channel is mentioned, sets the topic of the current channel with the given name.',
  permission: 'Manage Channels',
  usage: 'setTopic [#channel-mention] <Channel Topic>',
  example: ['setTopic #channel-name New Topic', 'setTopic New Topic']
};
