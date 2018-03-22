/**
 * @file deleteRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.mention && !args.id && !args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let role = message.mentions.roles.first();
    if (!role) {
      if (args.id) {
        role = message.guild.roles.get(args.id);
      }
      else if (args.name) {
        role = message.guild.roles.find('name', args.name.join(' '));
      }
    }

    if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
    else if (!role) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    await role.delete();

    await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: Bastion.strings.info(message.guild.language, 'deleteRole', message.author.tag, role.name)
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'deleter' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', multiple: true, defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deleteRole',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'deleteRole < [-m] @Role Mention | -i ROLE_ID | -n Role Name >',
  example: [ 'deleteRole -m @Server Staffs', 'deleteRole -i 295982817647788032', 'deleteRole -n Server Staffs' ]
};
