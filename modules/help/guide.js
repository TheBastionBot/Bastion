/**
 * @file guide command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.yellow,
      title: 'Bastion BOT - Guide',
      url: 'https://bastion.js.org/',
      description: 'Need help installing and setting up Private Bastion BOT? No worries, we have made an amazing guide to help you out on that. And if you don\'t understand that or you need any more help or maybe if you just have a simple question, just join our Support Server on Discord.',
      fields: [
        {
          name: 'Bastion BOT - Installation Guide',
          value: 'https://bastion.js.org/guide/'
        },
        {
          name: 'Bastion BOT - Support Server',
          value: 'https://discord.gg/fzx8fkt'
        }
      ]
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
  name: 'guide',
  description: string('guide', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'guide',
  example: []
};
