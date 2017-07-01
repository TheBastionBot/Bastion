/**
 * @file serverID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
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
  name: 'serverid',
  description: string('serverID', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'serverID',
  example: []
};
