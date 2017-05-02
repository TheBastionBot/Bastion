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
  if (!message.member.hasPermission('MANAGE_ROLES')) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (args.length < 3) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  args = args.join(' ').split(' - ');
  let oldName = args[0];
  let newName = args[1];
  if (!(role = message.guild.roles.find('name', oldName))) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: 'No role found with that name.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  role.setName(newName).then(() => {
    message.channel.send({embed: {
      color: Bastion.colors.green,
      title: 'Role Renamed',
      fields: [
        {
          name: 'From',
          value: oldName,
          inline: true
        },
        {
          name: 'To',
          value: newName,
          inline: true
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['renr']
};

exports.help = {
  name: 'renamerole',
  description: 'Renames a given role to a given new name.',
  permission: 'Manage Roles',
  usage: 'renameRole <Old Role Name> - <New Role Name>',
  example: ['renameRole Old Role Name - New Role Name']
};
