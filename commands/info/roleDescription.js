/**
 * @file roleDescription command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.role) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.role = args.role.join(' ');
    let role;
    if (message.guild.roles.has(args.role)) {
      role = message.guild.roles.get(args.role);
    }
    else {
      role = message.guild.roles.find('name', args.role);
    }
    if (!role) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }

    let roleDescription = args.description && args.description.length
      ? args.description.join(' ')
      : null;
    let messageDescription = roleDescription;
    let messageColor = Bastion.colors.RED;
    let messageTitle = 'Role Description Removed';

    let charLimit = 256;
    if (roleDescription) {
      if (roleDescription.length > charLimit) {
        return Bastion.emit('error', '', 'Role description is limited to 256 characters.', message.channel);
      }

      roleDescription = await Bastion.methods.encodeString(roleDescription);
      messageColor = Bastion.colors.GREEN;
      messageTitle = 'Role Description Set';
    }

    await Bastion.database.models.role.upsert({
      roleID: role.id,
      guildID: message.guild.id,
      description: roleDescription
    },
    {
      where: {
        roleID: role.id
      },
      fields: [ 'roleID', 'guildID', 'description' ]
    });

    message.channel.send({
      embed: {
        color: messageColor,
        title: messageTitle,
        description: messageDescription,
        footer: {
          text: role.name
        }
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true },
    { name: 'description', type: String, multiple: true, alias: 'd' }
  ]
};

exports.help = {
  name: 'roleDescription',
  description: 'Set a description for a role, which will be shown in the `roleInfo` command.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'roleDescription < ROLE_ID | ROLE NAME > < -d text >',
  example: [ 'roleDescription Administrators -d These are the amazing people who manage this server.', 'roleDescription 218262649910853631 -d These are the cool people who moderate this server.' ]
};
