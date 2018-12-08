/**
 * @file channelTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Channel Topic',
      description: (channel.topic === null || channel.topic.length < 2) ? 'No channel topic present' : channel.topic
    }
  });
};

exports.config = {
  aliases: [ 'ct' ],
  enabled: true
};

exports.help = {
  name: 'channelTopic',
  description: 'Shows the channel topic of text channel of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelTopic [#channel-mention]',
  example: [ 'channelTopic #channel-name', 'channelTopic' ]
};
