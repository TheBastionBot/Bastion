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

module.exports = member => {
  SQL.get(`SELECT greet, greetMessage, greetChannelID, greetTimeout FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.greet === 'true') {
      let greetMsg = row.greetMessage;
      greetMsg = greetMsg.replace(/\$user/ig, `<@${member.id}>`);
      greetMsg = greetMsg.replace(/\$server/ig, member.guild.name);
      greetMsg = greetMsg.replace(/\$username/ig, member.displayName);
      greetMsg = greetMsg.replace(/\$prefix/ig, member.client.config.prefix);

      member.guild.channels.get(row.greetChannelID).send({embed: {
        color: member.client.colors.green,
        title: `Hello ${member.displayName}`,
        description: greetMsg
      }}).then(m => {
        if (row.greetTimeout > 0) {
          m.delete(1000*parseInt(row.greetTimeout)).catch(e => {
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

  SQL.get(`SELECT greetDM, greetDMMessage FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;

    if (row.greetDM === 'true') {
      let greetDMMsg = row.greetDMMessage;
      greetDMMsg = greetDMMsg.replace(/\$user/ig, `<@${member.id}>`);
      greetDMMsg = greetDMMsg.replace(/\$server/ig, member.guild.name);
      greetDMMsg = greetDMMsg.replace(/\$username/ig, member.displayName);
      greetDMMsg = greetDMMsg.replace(/\$prefix/ig, member.client.config.prefix);

      member.send({embed: {
        color: member.client.colors.green,
        title: `Hello ${member.displayName}`,
        description: greetDMMsg
      }}).then(m => {
        if (row.greetTimeout > 0) {
          m.delete(1000*parseInt(row.greetTimeout)).catch(e => {
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

  SQL.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    member.guild.channels.get(row.logChannelID).send({embed: {
      color: member.client.colors.green,
      title: 'User Joined',
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
      timestamp: member.joinedAt
    }}).catch(e => {
      member.client.log.error(e.stack);
    });
  }).catch(e => {
    member.client.log.error(e.stack);
  });

  SQL.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${member.guild.id}`).then(row => {
    if (!row) return;
    autoAssignableRoles = JSON.parse(row.autoAssignableRoles);
    autoAssignableRoles = autoAssignableRoles.filter(r => member.guild.roles.get(r));
    if (autoAssignableRoles.length < 1) return;
    member.guild.members.get(member.id).addRoles(autoAssignableRoles).catch(e => {
      member.client.log.error(e.stack);
    });
  }).catch(e => {
    member.client.log.error(e.stack);
  });
};
