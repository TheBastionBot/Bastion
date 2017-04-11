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

module.exports = (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (oldChannel.name == newChannel.name) return;

  sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newChannel.guild.id}`).then(row => {
    if (!row) return;
    if (row.log == 'false') return;

    newChannel.guild.channels.get(row.logChannelID).sendMessage('', {embed: {
      color: 5088314,
      title: 'Channel Name Changed',
      fields: [
        {
          name: 'Old Name',
          value: oldChannel.name,
          inline: true
        },
        {
          name: 'New Name',
          value: newChannel.name,
          inline: true
        },
        {
          name: 'Changed At',
          value: new Date().toUTCString(),
          inline: false
        },
        {
          name: 'ID',
          value: newChannel.id,
          inline: true
        },
        {
          name: 'Type',
          value: newChannel.type,
          inline: true
        }
      ]
    }}).catch(e => {
      newChannel.client.log.error(e.stack);
    });
  }).catch(e => {
    newChannel.client.log.error(e.stack);
  });
};
