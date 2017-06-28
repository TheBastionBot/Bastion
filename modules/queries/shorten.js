/**
 * @file shorten command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const request = require('request');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = encodeURI(args.join(' '));
  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('invalidInput', 'errorMessage', 'URL'), message.channel);
  }

  let options = {
    uri: `https://www.googleapis.com/urlshortener/v1/url?key=${Bastion.credentials.googleAPIkey}`,
    method: 'POST',
    json: {
      longUrl: args
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), string('connection', 'errorMessage'), message.channel);
    }
    if (response.statusCode === 200) {
      message.channel.send({
        embed: {
          color: Bastion.colors.blue,
          fields: [
            {
              name: 'Long URL',
              value: args
            },
            {
              name: 'Short URL',
              value: body.id
            }
          ],
          footer: {
            text: 'Powered by Google'
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', `${response.statusCode}`, response.statusMessage, message.channel);
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'shorten',
  description: string('shorten', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://bastion.js.org/SomeLongURL' ]
};
