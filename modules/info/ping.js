/**
 * @file ping command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      description: `${parseInt(Bastion.ping)}ms`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ping',
  description: string('ping', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'ping',
  example: []
};
