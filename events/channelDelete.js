/**
 * @file channelDelete event
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

    let title = channel.client.strings.events(channel.guild.language, 'channelDelete');
    if (channel.type === 'text') {
      title = channel.client.strings.events(channel.guild.language, 'textChannelDelete');
    }
    else if (channel.type === 'voice') {
      title = channel.client.strings.events(channel.guild.language, 'voiceChannelDelete');
    }
    else if (channel.type === 'category') {
      title = channel.client.strings.events(channel.guild.language, 'categoryChannelDelete');
    }

    logChannel.send({
      embed: {
        color: channel.client.colors.RED,
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
