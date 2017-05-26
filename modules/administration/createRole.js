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
  if (!message.member.hasPermission('MANAGE_ROLES')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let data;
  if (args[0] !== undefined && args[0].indexOf('#') === 0) {
    if (args[0].length !== 7) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Role color should be a 6 digit `HEX` color code.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    data = args[1] === undefined ? data = roleData('new role', args[0]) : roleData(args.slice(1).join(' '), args[0]);
  }
  else {
    data = args[0] === undefined ? data = roleData() : roleData(args.join(' '));
  }

  message.guild.createRole(data).then(role => message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'Role Created',
      fields: [
        {
          name: 'Role Name',
          value: role.name,
          inline: true
        },
        {
          name: 'Role ID',
          value: role.id,
          inline: true
        },
        {
          name: 'Color',
          value: role.hexColor,
          inline: true
        },
        {
          name: 'Position',
          value: role.position,
          inline: true
        },
        {
          name: 'Hoisted',
          value: role.hoist,
          inline: true
        },
        {
          name: 'Mentionable',
          value: role.mentionable,
          inline: true
        }
      ]
    }
  })).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'cr' ],
  enabled: true
};

exports.help = {
  name: 'createrole',
  description: 'Creates a new role with a given color (optional) and a given name (optional).',
  botPermission: 'Manage Roles',
  userPermission: 'Manage Roles',
  usage: 'createrole [#hex-color-code] [Role Name]',
  example: [ 'createrole #dc143c Role Name', 'createrole #dc143c', 'createrole Role Name', 'createrole' ]
};

/**
 * Takes Discord role info and returns the role data object for use.
 * @function roleData
 * @param {string} [name=new role] role The array that contains the character pool.
 * @param {string} [color=0] The array of the string to match with the character pool.
 * @returns {object} The Discord role data object.
*/
function roleData(name = 'new role', color = '#000000') {
  let data = {
    name: name,
    color: color
  };
  return data;
}
