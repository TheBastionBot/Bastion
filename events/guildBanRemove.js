/**
 * @file guildBanRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');
SQL.open('./data/Bastion.sqlite');

module.exports = (guild, user) => {
  SQL.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    guild.channels.get(row.logChannelID).send({
      embed: {
        color: guild.client.colors.green,
        title: 'User Unbanned',
        fields: [
          {
            name: 'User',
            value: user.tag,
            inline: true
          },
          {
            name: 'User ID',
            value: user.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      guild.client.log.error(e.stack);
    });
  }).catch(e => {
    guild.client.log.error(e.stack);
  });
};
