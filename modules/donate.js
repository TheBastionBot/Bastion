/**
 * @file donate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.DARK_GREEN,
      title: 'Support Bastion Bot project',
      url: 'https://bastionbot.org/',
      description: 'To support and send donations for the Bastion Bot, ' +
                   'you can either pledge for The Bastion Bot project ' +
                   'on **Patreon**: https://patreon.com/bastionbot\nOR\nSend ' +
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'donate',
  example: []
};
