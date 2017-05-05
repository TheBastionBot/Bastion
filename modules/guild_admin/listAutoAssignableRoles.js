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

exports.run = (Bastion, message, args) => {
  sql.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.autoAssignableRoles === '[]') {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'No auto assignable roles found.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    let roles = JSON.parse(row.autoAssignableRoles);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = roles.unique(roles);
    let roleNames = [];
    for (let i = 0; i < roles.length; i++) {
      roleNames.push(message.guild.roles.get(roles[i]).name);
    }
    roleNames = roleNames.map((r, i) => `${i + 1}. ${r}`);
    let i = 0;
    if (isNaN(args = parseInt(args[0]))) {
      i = 1;
    }
    else {
      i = (args > 0 && args < roleNames.length / 10 + 1) ? args : 1;
    }
    i = i - 1;
    message.channel.send({embed: {
      color: Bastion.colors.dark_grey,
      title: 'Auto assignable roles:',
      description: roleNames.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${parseInt(roleNames.length / 10 + 1)}`
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['laar']
};

exports.help = {
  name: 'listautoassignableroles',
  description: 'Lists all auto assignable roles.',
  botPermission: '',
  userPermission: '',
  usage: 'listAutoAssignableRoles [page_no]',
  example: ['listAutoAssignableRoles', 'listAutoAssignableRoles 2']
};
