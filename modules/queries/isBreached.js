/**
 * @file isBreached command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.name = args.name.join('');
  request({
    uri: `https://haveibeenpwned.com/api/v2/breach/${args.name}`,
    headers: {
      'User-Agent': 'BastionBot/k3rn31p4nic',
      'Accept': 'application/json'
    },
    method: 'GET'
  }, async function (err, res, body) {
    try {
      if (err) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
      }

      if (res && res.statusCode === 200) {
        body = await JSON.parse(body);
        await message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            author: {
              name: body.Title,
              url: `http://${body.Domain}`
            },
            fields: [
              {
                name: 'Compromised Data',
                value: body.DataClasses.join(', ')
              },
              {
                name: 'Breach Date',
                value: body.BreachDate,
                inline: true
              },
              {
                name: 'Verified',
                value: body.IsVerified,
                inline: true
              }
            ],
            footer: {
              text: 'Powered by Have I been pwned?'
            }
          }
        });
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', res.statusCode, res.statusMessage, message.channel);
      }
    }
    catch (e) {
      Bastion.log.error(e);
    }
  });
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
