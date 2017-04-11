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

exports.run = (Bastion, message, args) => {
  if (args.length < 1) return;
  if (!(role = message.mentions.roles.first())) {
    role = message.guild.roles.find('name', args.join(' '));
  }

  if (role) {
    message.channel.sendMessage('', {embed: {
      color: 6651610,
      title: 'Role info',
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
          name: 'Hoisted',
          value: role.hoist ? 'Yes' : 'No',
          inline: true
        },
        {
          name: 'External',
          value: role.managed ? 'Yes' : 'No',
          inline: true
        },
        {
          name: 'Created At',
          value: role.createdAt.toUTCString(),
          inline: true
        },
        {
          name: 'Users',
          value: role.members.size,
          inline: true
        }
      ],
      thumbnail: {
        url: `https://dummyimage.com/250/${role.hexColor.slice(1)}/&text=%20`,
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'The specified role was not found.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['rinfo']
};

exports.help = {
  name: 'roleinfo',
  description: 'Shows information about the specified role.',
  permission: '',
  usage: 'roleInfo <@role-mention|role_name>',
  example: ['roleInfo @Dark Knigths', 'roleInfo The Legends']
};
