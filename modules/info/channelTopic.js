/**
 * @file channelTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
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
  name: 'channelTopic',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelTopic [#channel-mention]',
  example: [ 'channelTopic #channel-name', 'channelTopic' ]
};
