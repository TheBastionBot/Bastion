/**
 * @file support command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.yellow,
      title: 'Bastion BOT - Support Server',
      url: 'https://discord.gg/fzx8fkt',
      description: 'Need help or support with Bastion Discord BOT?\nJoin Bastion Support Server for any help you need.\nhttps://discord.gg/fzx8fkt',
      fields: [
        {
          name: 'Website',
          value: 'https://BastionBot.org/'
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ss' ],
  enabled: true
};

exports.help = {
  name: 'support',
  description: string('support', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'support',
  example: []
};
