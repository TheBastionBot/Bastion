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

module.exports = (oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;

  SQL.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newRole.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    newRole.guild.channels.get(row.logChannelID).send({
      embed: {
        color: newRole.client.colors.yellow,
        title: 'Role Name Changed',
        fields: [
          {
            name: 'Old Role Name',
            value: oldRole.name,
            inline: true
          },
          {
            name: 'New Role Name',
            value: newRole.name,
            inline: true
          },
          {
            name: 'Role ID',
            value: newRole.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newRole.client.log.error(e.stack);
    });
  }).catch(e => {
    newRole.client.log.error(e.stack);
  });
};
