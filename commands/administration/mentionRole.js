/**
 * @file mentionRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.role) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.role = args.role.join(' ');

  let role;
  if (message.mentions.roles.size) {
    role = message.mentions.roles.first();
  }
  else if (message.guild.roles.has(args.role)) {
    role = message.guild.roles.get(args.role);
  }
  else {
    role = message.guild.roles.find(role => role.name === args.role);
  }

  if (role.editable) {
    await role.setMentionable(true, 'Role needs to be mentioned.');
    await message.channel.send(`<@&${role.id}>`);
    await role.setMentionable(false, 'Role doesn\'t needs to be mentioned anymore.');
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'mentionRole',
  description: 'Mentions any unmentionable role.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'mentionRole < ROLE_ID | ROLE NAME | @ROLE MENTION >',
  example: [ 'mentionRole The Legends', 'mentionRole 199583703265316211', 'mentionRole @The Defenders' ]
};
