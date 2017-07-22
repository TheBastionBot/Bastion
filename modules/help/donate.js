/**
 * @file donate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: 3050327,
      title: 'Support Bastion Bot project',
      url: 'https://BastionBot.org/',
      description: 'To support and send donations for the Bastion Bot, ' +
                   'you can either pledge for The Bastion Bot project ' +
                   'on **Patreon**: https://patreon.com/snkrsnkampa\nOR\nSend ' +
                   'one off donations via **PayPal**: https://paypal.me/snkrsnkampa'
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
  name: 'donate',
  description: string('donate', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'donate',
  example: []
};
