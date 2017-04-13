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

module.exports = (oldGuild, newGuild) => {
  if (oldGuild.name == newGuild.name) return;

  sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newGuild.id}`).then(row => {
    if (!row) return;
    if (row.log == 'false') return;

    newGuild.channels.get(row.logChannelID).sendMessage('', {embed: {
      color: Bastion.colors.green,
      title: 'Guild Name Changed',
      fields: [
        {
          name: 'Old Name',
          value: oldGuild.name,
          inline: true
        },
        {
          name: 'New Name',
          value: newGuild.name,
          inline: true
        },
        {
          name: 'ID',
          value: newGuild.id,
          inline: true
        }
      ]
    }}).catch(e => {
      newGuild.client.log.error(e.stack);
    });
  }).catch(e => {
    newGuild.client.log.error(e.stack);
  });
};
