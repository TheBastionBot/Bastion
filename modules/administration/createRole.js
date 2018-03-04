/**
 * @file createRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!Bastion.resolver.resolveColor(args.color)) {
      args.color = 0;
    }

    let maxLength = 100;
    if (args.name && args.name.join(' ').length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'roleNameLength', true, maxLength), message.channel);
    }

    let data = roleData(args.name.join(' '), args.color);
    let role = await message.guild.createRole(data);

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'createRole', message.author.tag, role.name),
        footer: {
          text: `ID: ${role.id}`
        }
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'creater' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', multiple: true, defaultOption: true, defaultValue: [ 'new role' ] },
    { name: 'color', type: String, alias: 'c', defaultValue: '0' }
  ]
};

exports.help = {
  name: 'createRole',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
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
