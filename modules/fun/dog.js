/**
 * @file dog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');
const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  let baseURL = 'https://random.dog/';
  request(`${baseURL}woof`, function (error, response, body) {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), string('connection', 'errorMessage'), message.channel);
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
  userPermission: '',
  usage: 'dog',
  example: []
};
