/**
 * @file np command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'np',
  description: string('np', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'np',
  example: []
};
