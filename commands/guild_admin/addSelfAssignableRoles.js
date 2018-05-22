/**
 * @file addSelfAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'selfAssignableRoles' ],
      where: {
        guildID: message.guild.id
      }
    });

    let roles = [];
    if (guildModel.dataValues.selfAssignableRoles) {
      roles = guildModel.dataValues.selfAssignableRoles;
    }
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];

    await Bastion.database.models.guild.update({
      selfAssignableRoles: roles
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'selfAssignableRoles' ]
    });

    let roleNames = [];
    for (let i = 0; i < args.length; i++) {
      roleNames.push(message.guild.roles.get(args[i]).name);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added self assignable roles',
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
  aliases: [ 'asar' ],
  enabled: true
};

exports.help = {
  name: 'addSelfAssignableRoles',
  description: 'Adds specified roles to the list of self-assignable roles, anyone could use `iAm`/`iAmNot` command to get/revoke these roles to themselves.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addSelfAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addSelfAssignableRoles 443322110055998877 778899550011223344' ]
};
