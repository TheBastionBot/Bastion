/**
 * @file isBreached command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.name = args.name.join('');

    let options = {
      method: 'GET',
      headers: {
        'User-Agent': 'BastionBot/k3rn31p4nic',
        'Accept': 'application/json'
      },
      url: `https://haveibeenpwned.com/api/v2/breach/${args.name}`,
      json: true
    };
    let response = await request(options);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: response.Title,
          url: `http://${response.Domain}`
        },
        fields: [
          {
            name: 'Compromised Data',
            value: response.DataClasses.join(', ')
          },
          {
            name: 'Breach Date',
            value: response.BreachDate,
            inline: true
          },
          {
            name: 'Verified',
            value: response.IsVerified,
            inline: true
          }
        ],
        footer: {
          text: 'Powered by Have I been pwned?'
        }
      }
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
  aliases: [ 'isPwned' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'isBreached',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'isBreached <site_name>',
  example: [ 'isBreached Adobe' ]
};
