/**
 * @file cat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message) => {
  request('http://random.cat/meow', async function (error, response, body) {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
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
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'cat',
  example: []
};
