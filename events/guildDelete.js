/**
 * @file guildDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = guild => {
  guild.client.db.run(`DELETE FROM guildSettings WHERE guildID=${guild.id}`).catch(e => {
    guild.client.log.error(e);
  });

  guild.client.webhook.send('bastionLog', {
    color: guild.client.colors.RED,
    title: guild.client.strings.events(guild.language, 'guildDelete'),
    fields: [
      {
        name: 'Server Name',
        value: guild.name,
        inline: true
      },
      {
        name: 'Server ID',
        value: guild.id,
        inline: true
      },
      {
        name: 'Server Owner',
        value: guild.owner.user.tag,
        inline: true
      },
      {
        name: 'Server Owner ID',
        value: guild.ownerID,
        inline: true
      }
    ],
    thumbnail: {
      url: guild.iconURL || 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
    },
    timestamp: new Date()
  });
};
