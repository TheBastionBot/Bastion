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
  if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return Bastion.log.info('You don\'t have permissions to use this command.');

  if (args[0] !== undefined && args[0].indexOf('#') == 0 && args[1] !== undefined) {
    if (args[0].length != 7) {
      return message.channel.sendMessage('', {embed: {
        color: Bastion.colors.red,
        description: 'Role color should be a 6 digit `HEX` color code.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    if (!(role = message.guild.roles.find('name', args.slice(1).join(' ')))) {
      return message.channel.sendMessage('', {embed: {
        color: Bastion.colors.red,
        description: 'No role found with that name.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    role.setColor(args[0]).then(() => {
      message.channel.sendMessage('', {embed: {
        color: Bastion.colors.green,
        title: 'Role Color Changed',
        description: `**${role.name}** role color changed.`,
        fields: [
          {
            name: 'From',
            value: role.hexColor,
            inline: true
          },
          {
            name: 'To',
            value: args[0],
            inline: true
          }
        ],
        thumbnail: {
          url: `https://dummyimage.com/250/${args[0].slice(1)}/&text=%20`,
        }
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
      message.channel.sendMessage('', {embed: {
        color: Bastion.colors.red,
        description: 'I don\'t have enough permission to do that operation.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    });
  }
};

exports.config = {
  aliases: ['rc']
};

exports.help = {
  name: 'rolecolor',
  description: 'Change the color of a given role.',
  permission: 'Manage Roles',
  usage: 'roleColor <#hex-color-code> <Role Name>',
  example: ['roleColor #00ff00 Role Name']
};
