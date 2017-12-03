/**
 * @file endpoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'endpoll',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'endpoll',
  example: []
};
