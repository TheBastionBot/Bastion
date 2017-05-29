/**
 * @file guildCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');
SQL.open('./data/Bastion.sqlite');

module.exports = guild => {
  SQL.run('CREATE TABLE IF NOT EXISTS guildSettings' +
          '(guildID TEXT NOT NULL UNIQUE,' +
          'greet TEXT NOT NULL DEFAULT \'false\',' +
          'greetChannelID TEXT,' +
          'greetMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
          'greetTimeout INTEGER NOT NULL DEFAULT 30,' +
          'greetDM TEXT NOT NULL DEFAULT \'false\',' +
          'greetDMMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
          'farewell TEXT NOT NULL DEFAULT \'false\',' +
          'farewellChannelID TEXT UNIQUE,' +
          'farewellMessage TEXT NOT NULL DEFAULT \'We hope you enjoyed your stay here!\',' +
          'farewellTimeout INTEGER NOT NULL DEFAULT 15,' +
          'log TEXT NOT NULL DEFAULT \'false\',' +
          'logChannelID TEXT UNIQUE,' +
          'musicTextChannelID TEXT UNIQUE,' +
          'musicVoiceChannelID TEXT UNIQUE,' +
          'filterInvite TEXT NOT NULL DEFAULT \'false\',' +
          'filterLink TEXT NOT NULL DEFAULT \'false\',' +
          'chat TEXT NOT NULL DEFAULT \'false\',' +
          'levelUpMessage TEXT NOT NULL DEFAULT \'true\',' +
          'selfAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'autoAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'modLog TEXT NOT NULL DEFAULT \'false\',' +
          'modLogChannelID TEXT UNIQUE,' +
          'modCaseNo TEXT NOT NULL DEFAULT \'1\',' +
          'PRIMARY KEY(guildID))').then(() => {
            SQL.run('INSERT OR IGNORE INTO guildSettings (guildID) VALUES (?)', [ guild.id ]).catch(e => {
              guild.client.log.error(e.stack);
            });
          }).catch(e => {
            guild.client.log.error(e.stack);
          });

  SQL.get('SELECT log, logChannelID FROM bastionSettings').then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    guild.client.channels.get(row.logChannelID).send({
      embed: {
        color: guild.client.colors.green,
        title: 'Joined new server',
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
