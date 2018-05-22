/**
 * @file ignoreRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.roles) return;

    let roles = args.roles;
    roles = roles.filter(roleID => message.guild.roles.has(roleID));

    for (let roleID of roles) {
      await Bastion.database.models.role.upsert({
        roleID: roleID,
        guildID: message.guild.id,
        blacklisted: !args.remove
      },
      {
        where: {
          roleID: roleID,
          guildID: message.guild.id
        },
        fields: [ 'roleID', 'guildID', 'blacklisted' ]
      });
    }

    let description;
    if (args.remove) {
      description = 'I\'ll stop ignoring these roles, from now:';
    }
    else {
      description = 'I\'ll ignore these roles, from now:';
    }

    roles = roles.map(roleID => message.guild.roles.get(roleID).name);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${description}\n\n${roles.join(', ')}`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'ignoreRole' ],
  enabled: true,
  argsDefinitions: [
    { name: 'roles', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r', defaultValue: false }
  ]
};

exports.help = {
  name: 'ignoreRoles',
  description: 'Adds or removes roles to/from the ignored roles\' list. Bastion doesn\'t accept any commands from the roles that are being ignored.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreRoles [ROLE_ID] [--remove]',
  example: [ 'ignoreRoles', 'ignoreRoles 198543847789401471 298543847779426364', 'ignoreRoles 298543847779426364 408313848439426856 --remove' ]
};
