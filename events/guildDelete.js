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
