/**
 * @file serverID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Server ID',
      description: message.guild.id
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sid' ],
  enabled: true
};

exports.help = {
  name: 'serverID',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverID',
  example: []
};
