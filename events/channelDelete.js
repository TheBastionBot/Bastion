/**
 * @file channelDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = channel => {
  if (!channel.guild) return;

  channel.client.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${channel.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    channel.guild.channels.get(row.logChannelID).send({
      embed: {
        color: channel.client.colors.red,
        title: 'Channel Deleted',
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
          },
          {
            name: 'Channel Type',
            value: channel.type.toUpperCase(),
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      channel.client.log.error(e.stack);
    });
  }).catch(e => {
    channel.client.log.error(e.stack);
  });
};
