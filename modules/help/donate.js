/**
 * @file donate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: 3050327,
      title: 'Support Bastion BOT project',
      url: 'https://bastion.js.org/',
      description: 'You can support and send donations for the Bastion BOT project on patreon: https://patreon.com/snkrsnkampa'
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'donate',
  description: 'Instructions on how to financially help the Bastion BOT project.',
  botPermission: '',
  userPermission: '',
  usage: 'donate',
  example: []
};
