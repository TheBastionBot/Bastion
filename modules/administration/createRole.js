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

const roleData = require('../../functions/roleData').func;

exports.run = function(Bastion, message, args) {
  if (!message.guild.members.get(message.author.id).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (args[0] !== undefined && args[0].indexOf('#') == 0) {
    if (args[0].length != 7) return;
    data = args[1] === undefined ? data = roleData('new role', args[0]) : roleData(args.slice(1).join(' '), args[0]);
  }
  else data = args[0] === undefined ? data = roleData() : roleData(args.join(' '));

  message.guild.createRole(data).then(role => message.channel.sendMessage('', {embed: {
    color: 5088314,
    title: 'Role Created',
    fields: [
      {
        name: 'Name',
        value: role.name,
        inline: true
      },
      {
        name: 'ID',
        value: role.id,
        inline: true
      },
      {
        name: 'Position',
        value: role.position,
        inline: true
      },
      {
        name: 'Color',
        value: role.hexColor,
        inline: true
      },
      {
        name: 'Hoist',
        value: role.hoist,
        inline: true
      },
      {
        name: 'Mentionable',
        value: role.mentionable,
        inline: true
      }
    ]
  }})).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['cr']
};

exports.help = {
  name: 'createrole',
  description: 'Creates a new role with a given color (optional) and a given name (optional).',
  permission: 'Manage Roles',
  usage: ['createrole #dc143c Role Name', 'createrole #dc143c', 'createrole Role Name', 'createrole']
};
