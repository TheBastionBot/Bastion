/**
 * @file support command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Bastion HQ',
      url: 'https://discord.gg/fzx8fkt',
      description: 'Need help or support with Bastion Discord Bot?\nJoin Bastion Support Server for any help you need.\nhttps://discord.gg/fzx8fkt',
      fields: [
        {
          name: 'Website',
          value: 'https://bastionbot.org/'
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
  description: 'Sends the invite link to Bastion HQ.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'support',
  example: []
};
