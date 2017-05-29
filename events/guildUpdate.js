/**
 * @file guildUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');
SQL.open('./data/Bastion.sqlite');

module.exports = (oldGuild, newGuild) => {
  if (oldGuild.name === newGuild.name) return;

  SQL.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newGuild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    newGuild.channels.get(row.logChannelID).send({
      embed: {
        color: newGuild.client.colors.yellow,
        title: 'Server Name Changed',
        fields: [
          {
            name: 'Old Server Name',
            value: oldGuild.name,
            inline: true
          },
          {
            name: 'New Server Name',
            value: newGuild.name,
            inline: true
          },
          {
            name: 'Server ID',
            value: newGuild.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newGuild.client.log.error(e.stack);
    });
  }).catch(e => {
    newGuild.client.log.error(e.stack);
  });
};
