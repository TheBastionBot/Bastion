/**
 * @file endpoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
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
  description: string('endpoll', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'endpoll',
  example: []
};
