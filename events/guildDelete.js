/**
 * @file guildDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');
SQL.open('./data/Bastion.sqlite');

module.exports = guild => {
  SQL.run(`DELETE FROM guildSettings WHERE guildID=${guild.id}`).catch(e => {
    guild.client.log.error(e.stack);
  });

  SQL.get('SELECT log, logChannelID FROM bastionSettings').then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    guild.client.channels.get(row.logChannelID).send({
      embed: {
        color: guild.client.colors.red,
        title: 'Left a server',
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
        timestamp: guild.joinedAt
      }
    }).catch(e => {
      guild.client.log.error(e.stack);
    });
  }).catch(e => {
    guild.client.log.error(e.stack);
  });
};
