/**
 * @file endpoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.channel.poll && message.channel.poll.collector) {
    message.channel.poll.collector.stop();
  }
};

exports.config = {
  aliases: [ 'pollend' ],
  enabled: true
};

exports.help = {
  name: 'endpoll',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'endpoll',
  example: []
};
