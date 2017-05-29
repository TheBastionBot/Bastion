/**
 * @file support command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
          value: 'https://bastion.js.org/'
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'ss' ],
  enabled: true
};

exports.help = {
  name: 'support',
  description: 'Sends the invite link to Bastion BOT Support Server.',
  botPermission: '',
  userPermission: '',
  usage: 'support',
  example: []
};
