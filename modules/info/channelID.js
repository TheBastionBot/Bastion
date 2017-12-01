/**
 * @file channelID command
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
      fields: [
        {
          name: 'Channel',
          value: `#${channel.name}`,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cid' ],
  enabled: true
};

exports.help = {
  name: 'channelID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelID [#channel-mention]',
  example: [ 'channelID #channel-name', 'channelID' ]
};
