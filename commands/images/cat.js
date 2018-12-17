/**
 * @file cat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message) => {
  let options = {
    method: 'HEAD',
    url: 'https://thecatapi.com/api/images/get',
    followAllRedirects: true,
    resolveWithFullResponse: true
  };
  let response = await request(options);

  await message.channel.send({
    files: [ response.request.uri.href ]
  });
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
