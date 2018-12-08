/**
 * @file fortune command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fortuneCookies = xrequire('./assets/fortuneCookies.json');

exports.exec = async (Bastion, message) => {
  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Your fortune says...',
      description: fortuneCookies.getRandom()
    }
  });
};

exports.config = {
  aliases: [ 'cookie' ],
  enabled: true
};

exports.help = {
  name: 'fortune',
  description: 'Shows you a fortune from a fortune cookie.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fortune',
  example: []
};
