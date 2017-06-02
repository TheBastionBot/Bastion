/**
 * @file shorten command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Invalid URL'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
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
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Some error has occured, please try again later.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
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
        Bastion.log.error(e.stack);
      });
    }
    else {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          title: `ERROR ${response.body.error.code}`,
          description: response.body.error.message
        }
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
  name: 'shorten',
  description: 'Shortens a specified URL using Google URL Shortner.',
  botPermission: '',
  userPermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://bastion.js.org/SomeLongURL' ]
};
