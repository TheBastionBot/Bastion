/**
 * @file cat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message) => {
  try {
    let options = {
      method: 'HEAD',
      url: 'https://thecatapi.com/api/images/get',
      followAllRedirects: true
    };
    let response = await request(options);

    await message.channel.send({
      files: [ response.original_image ]
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cat',
  description: 'Shows a random picture of a cat.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cat',
  example: []
};
