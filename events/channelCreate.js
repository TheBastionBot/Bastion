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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

module.exports = channel => {
  if (!channel.guild) return;

  sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${channel.guild.id}`).then(row => {
    if (!row) return;
    if (row.log == 'false') return;
    channel.guild.channels.get(row.logChannelID).sendMessage('', {embed: {
      color: 5088314,
      title: 'Channel Created',
      fields: [
        {
          name: 'Name',
          value: channel.name,
          inline: true
        },
        {
          name: 'ID',
          value: channel.id,
          inline: true
        },
        {
          name: 'Type',
          value: channel.type,
          inline: true
        },
        {
          name: 'Created At',
          value: channel.createdAt.toUTCString(),
          inline: false
        }
      ]
    }}).catch(e => {
      channel.client.log.error(e.stack);
    });
  }).catch(e => {
    channel.client.log.error(e.stack);
  });
};
