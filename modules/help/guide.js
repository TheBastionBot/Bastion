/**
 * @file guide command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Bastion Bot',
      url: 'https://bastionbot.org/',
      description: 'Need help installing and setting up Private Bastion Bot? No worries, we have made an amazing guide to help you out on that. And if you don\'t understand that or you need any more help or maybe if you just have a simple question, just join our Support Server on Discord.',
      fields: [
        {
          name: 'Bastion Bot - Installation Guide',
          value: 'https://docs.bastionbot.org/'
        },
        {
          name: 'Bastion Bot - Support Server',
          value: 'https://discord.gg/fzx8fkt'
        }
      ]
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
  name: 'guide',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'guide',
  example: []
};
