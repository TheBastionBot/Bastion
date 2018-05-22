/**
 * @file channelInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    if (parseInt(args[0]) < 9223372036854775807) {
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
    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'channelNotFound'), message.channel);
  }
};

exports.config = {
  aliases: [ 'cinfo' ],
  enabled: true
};

exports.help = {
  name: 'channelInfo',
  description: 'Shows information of a specified text or voice channel of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'channelInfo [#channel-mention | CHANNEL_ID]',
  example: [ 'channelInfo #channel-name', 'channelInfo 221133445599667788', 'channelInfo' ]
};
