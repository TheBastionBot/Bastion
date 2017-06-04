/**
 * @file serverID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Server ID',
      description: message.guild.id
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'sid' ],
  enabled: true
};

exports.help = {
  name: 'serverid',
  description: 'Shows the server\'s ID the command was invoked in.',
  botPermission: '',
  userPermission: '',
  usage: 'serverID',
  example: []
};
