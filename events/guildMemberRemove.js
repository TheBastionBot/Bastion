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

module.exports = member => {
  sql.get(`SELECT farewell, farewellMessage, farewellChannelID, farewellTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.farewell === 'true') {
      let farewellMsg = row.farewellMessage;
      farewellMsg = farewellMsg.replace(/\$user/ig, `<@${member.id}>`);
      farewellMsg = farewellMsg.replace(/\$server/ig, member.guild.name);
      farewellMsg = farewellMsg.replace(/\$username/ig, member.displayName);
      farewellMsg = farewellMsg.replace(/\$prefix/ig, member.client.config.prefix);

      member.guild.channels.get(row.farewellChannelID).send({embed: {
        color: member.client.colors.red,
        title: `Goodbye ${member.displayName}!`,
        description: farewellMsg + '\n:wave:'
      }}).then(m => {
        if (row.farewellTimeout > 0) {
          m.delete(1000*parseInt(row.farewellTimeout)).catch(e => {
            member.client.log.error(e.stack);
          });
        }
      }).catch(e => {
        member.client.log.error(e.stack);
      });
    }
  }).catch(e => {
    member.client.log.error(e.stack);
  });

  member.guild.fetchBans().then(users => {
    if (users.has(member.id)) return;

    sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
      if (!row) return;
      if (row.log === 'false') return;

      member.guild.channels.get(row.logChannelID).send({embed: {
        color: member.client.colors.red,
        title: 'User Left',
        fields: [
          {
            name: 'User',
            value: member.user.tag,
            inline: true
          },
          {
            name: 'User ID',
            value: member.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }}).catch(e => {
        member.client.log.error(e.stack);
      });
    }).catch(e => {
      member.client.log.error(e.stack);
    });
  }).catch(e => {
    member.client.log.error(e.stack);
  });
};
