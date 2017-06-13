/**
 * @file cat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.run = (Bastion, message) => {
  request('http://random.cat/meow', function (error, response, body) {
    if (error) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Some error has occured while getting data from server. Please try again later.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    if (response && response.statusCode === 200) {
      let cat;

      try {
        cat = JSON.parse(body).file;
      }
      catch (e) {
        return Bastion.log.error(e);
      }

      message.channel.send({
        files: [ cat ]
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cat',
  description: 'Sends a random cat image.',
  botPermission: '',
  userPermission: '',
  usage: 'cat',
  example: []
};
