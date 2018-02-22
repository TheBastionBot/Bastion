/**
 * @file addAutoAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    for (let i = 0; i < args.length; i++) {
      if (!(parseInt(args[i]) < 9223372036854775807)) {
        args.splice(args.indexOf(args[i]), 1);
      }
    }
    args = args.filter(r => message.guild.roles.get(r));
    if (args.length < 1) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let guildSettings =  await Bastion.db.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);

    let roles = [];
    if (guildSettings.autoAssignableRoles) {
      roles = guildSettings.autoAssignableRoles.split(' ');
    }
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];

    await Bastion.db.run(`UPDATE guildSettings SET autoAssignableRoles='${roles.join(' ')}' WHERE guildID=${message.guild.id}`);

    let roleNames = [];
    for (let i = 0; i < args.length; i++) {
      roleNames.push(message.guild.roles.get(args[i]).name);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added auto assignable roles',
        description: roleNames.join(', ')
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
  aliases: [ 'aaar' ],
  enabled: true
};

exports.help = {
  name: 'addAutoAssignableRoles',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addAutoAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addAutoAssignableRoles 443322110055998877 778899550011223344' ]
};
