/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
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
    SQL.run('INSERT OR IGNORE INTO guildSettings (guildID) VALUES (?)', [guild.id]).catch(e => {
      guild.client.log.error(e.stack);
    });
  }).catch(e => {
    guild.client.log.error(e.stack);
  });

  SQL.get(`SELECT log, logChannelID FROM bastionSettings`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    guild.client.channels.get(row.logChannelID).send({embed: {
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
    }}).catch(e => {
      guild.client.log.error(e.stack);
    });
  }).catch(e => {
    guild.client.log.error(e.stack);
  });
};
