/**
 * @file endpoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
  description: 'Ends a currently running poll in the same text channel and shows the result.',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'endpoll',
  example: []
};
