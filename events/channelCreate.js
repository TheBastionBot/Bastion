/**
 * @file channelCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async channel => {
  if (!channel.guild) return;

  try {
    let guildSettings = await channel.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${channel.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = channel.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    let title = channel.client.strings.events(channel.guild.language, 'channelCreate');
    if (channel.type === 'text') {
      title = channel.client.strings.events(channel.guild.language, 'textChannelCreate');
    }
    else if (channel.type === 'voice') {
      title = channel.client.strings.events(channel.guild.language, 'voiceChannelCreate');
    }
    else if (channel.type === 'category') {
      title = channel.client.strings.events(channel.guild.language, 'categoryChannelCreate');
    }

    logChannel.send({
      embed: {
        color: channel.client.colors.GREEN,
        title: title,
        fields: [
          {
            name: 'Channel Name',
            value: channel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: channel.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      channel.client.log.error(e);
    });
  }
  catch (e) {
    channel.client.log.error(e);
  }
};
