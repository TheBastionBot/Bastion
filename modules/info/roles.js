/**
 * @file roles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Roles',
      description: message.guild.roles.size > 10 ? `${message.guild.roles.map(r => r.name).splice(1, 10).join('\n')}\nand ${message.guild.roles.size - 10 - 1} roles.` :  message.guild.roles.map(r => r.name).splice(1).join('\n')
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'roles',
  description: 'Shows the list of roles in the server.',
  botPermission: '',
  userPermission: '',
  usage: 'roles',
  example: []
};
