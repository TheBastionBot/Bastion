/**
 * @file createRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!Bastion.resolver.resolveColor(args.color)) {
    args.color = 0;
  }

  let data = roleData(args.name.join(' '), args.color);

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
          value: role.hexColor === '#000000' ? args.color : role.hexColor,
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
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', multiple: true, defaultOption: true, defaultValue: [ 'new role' ] },
    { name: 'color', type: String, alias: 'c', defaultValue: '0' }
  ]
};

exports.help = {
  name: 'createrole',
  description: 'Creates a new role with a given color (optional) and a given name (optional).',
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'createrole [[-n] Role Name] [-c hex-color-code]',
  example: [ 'createrole -n Role Name -c #dc143', 'createrole -c #dc143c', 'createrole Role Name', 'createrole' ]
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
