/**
 * @file channelUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (oldChannel.name === newChannel.name) return;

  try {
    let guildSettings = await newChannel.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newChannel.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newChannel.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    let title = 'Channel Renamed';
    if (newChannel.type === 'text') {
      title = 'Text Channel Renamed';
    }
    else if (newChannel.type === 'voice') {
      title = 'Voice Channel Renamed';
    }

    logChannel.send({
      embed: {
        color: newChannel.client.colors.ORANGE,
        title: title,
        fields: [
          {
            name: 'Old Channel Name',
            value: oldChannel.name,
            inline: true
          },
          {
            name: 'New Channel Name',
            value: newChannel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: newChannel.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newChannel.client.log.error(e);
    });
  }
  catch (e) {
    newChannel.client.log.error(e);
  }
};
