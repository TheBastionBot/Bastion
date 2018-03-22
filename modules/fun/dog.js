/**
 * @file dog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message) => {
  try {
    let baseURL = 'http://random.dog';

    let options = {
      url: `${baseURL}/woof`,
      json: true
    };
    let response = await request(options);

    await message.channel.send({
      files: [ `${baseURL}/${response}` ]
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
  name: 'dog',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'dog',
  example: []
};
