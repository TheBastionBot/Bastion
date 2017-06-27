/**
 * @file channelTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Channel Topic',
      description: (channel.topic === null || channel.topic.length < 2) ? 'No channel topic present' : channel.topic
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ct' ],
  enabled: true
};

exports.help = {
  name: 'channeltopic',
  description: string('channelTopic', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'channelTopic [#channel-mention]',
  example: [ 'channelTopic #channel-name', 'channelTopic' ]
};
