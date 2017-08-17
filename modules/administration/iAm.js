/**
 * @file iAm command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    let guild = await Bastion.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (!guild) return;

    let role = message.guild.roles.find('name', args.join(' '));
    if (role === null) return;

    let selfAssignableRoles = JSON.parse(guild.selfAssignableRoles);
    if (!selfAssignableRoles.includes(role.id)) return;

    if (message.guild.me.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('I don\'t have permission to use this command on that role.');

    await message.guild.members.get(message.author.id).addRole(role);
    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author}, you have been given **${role.name}** role.`
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'iwant', 'ihave' ],
  enabled: true
};

exports.help = {
  name: 'iam',
  description: string('iAm', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: '',
  usage: 'iAm <role name>',
  example: [ 'iAm Looking to play' ]
};
