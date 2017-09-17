/**
 * @file cat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');
const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  request('http://random.cat/meow', async function (error, response, body) {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), string('connection', 'errorMessage'), message.channel);
    }

    if (response && response.statusCode === 200) {
      try {
        let cat = await JSON.parse(body).file;
        await message.channel.send({
          files: [ cat ]
        });
      }
      catch (e) {
        return Bastion.log.error(e);
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cat',
  botPermission: '',
  userPermission: '',
  usage: 'cat',
  example: []
};
