/**
 * @file channelUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (oldChannel.name === newChannel.name) return;

  oldChannel.client.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newChannel.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    newChannel.guild.channels.get(row.logChannelID).send({
      embed: {
        color: newChannel.client.colors.yellow,
        title: 'Channel Name Changed',
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
          },
          {
            name: 'Channel Type',
            value: newChannel.type.toUpperCase(),
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newChannel.client.log.error(e.stack);
    });
  }).catch(e => {
    newChannel.client.log.error(e.stack);
  });
};
