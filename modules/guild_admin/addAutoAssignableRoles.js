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
  if (!message.member.hasPermission('ADMINISTRATOR')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  for (let i = 0; i < args.length; i++) {
    if (!/^[0-9]{18}$/.test(args[i])) {
      args.splice(args.indexOf(args[i]), 1);
    }
  }
  args = args.filter(r => message.guild.roles.get(r));
  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: 'The role ID(s) you specified doesn\'t match any role.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let roles = JSON.parse(row.autoAssignableRoles);
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = roles.unique(roles);
    sql.run(`UPDATE guildSettings SET autoAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
      let roleNames = [];
      for (let i = 0; i < args.length; i++) {
        roleNames.push(message.guild.roles.get(args[i]).name);
      }
      message.channel.send({embed: {
        color: Bastion.colors.green,
        title: 'Added self assignable roles',
        description: roleNames.join(', ')
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['aaar']
};

exports.help = {
  name: 'addautoassignableroles',
  description: 'Adds roles, specified by role ID, to auto assignable roles category, anyone who joins the server gets these roles automatically.',
  botPermission: 'Manage Roles',
  userPermission: 'Administrator',
  usage: 'addAutoAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: ['addAutoAssignableRoles 443322110055998877 778899550011223344']
};
