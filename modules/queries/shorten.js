/**
 * @file shorten command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args = encodeURI(args.join(' '));
    if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
    }

    let options = {
      url: `https://www.googleapis.com/urlshortener/v1/url?key=${Bastion.credentials.googleAPIkey}`,
      method: 'POST',
      json: {
        longUrl: args
      }
    };

    let response = await request(options);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        fields: [
          {
            name: 'Long URL',
            value: args
          },
          {
            name: 'Short URL',
            value: response.id
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
  name: 'shorten',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://bastionbot.org/SomeLongURL' ]
};
