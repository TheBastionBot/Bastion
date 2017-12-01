/**
 * @file dog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message) => {
  let baseURL = 'https://random.dog/';
  request(`${baseURL}woof`, function (error, response, body) {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    if (response && response.statusCode === 200) {
      message.channel.send({
        files: [ baseURL + body ]
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  });
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
