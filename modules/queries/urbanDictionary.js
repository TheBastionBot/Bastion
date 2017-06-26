/**
 * @file urbanDictionary command
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

  request(`https://api.urbandictionary.com/v0/define?term=${args.join(' ')}`, function (err, response, body) {
    let color, description = '', data = [];

    if (err) {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the server. Please try again later.';
    }
    else if (response.statusCode === 200) {
      color = Bastion.colors.blue;
      try {
        body = JSON.parse(body).list[0];

        data = [
          {
            name: 'Word',
            value: body.word || args.join(' ')
          },
          {
            name: 'Definition',
            value: body.definition || '-'
          },
          {
            name: 'Example',
            value: body.example || '-'
          }
        ];
      }
      catch (e) {
        color = Bastion.colors.red;
        description = 'Some error has occured while parsing the received data. Please try again later.';
      }
    }
    else {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the server.';
      data = [
        {
          name: `${response.statusCode}`,
          value: response.statusMessage
        }
      ];
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Urban Dictionary',
        description: description,
        fields: data,
        footer: {
          text: 'Powered by Urban Dictionary'
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'ud' ],
  enabled: true
};

exports.help = {
  name: 'urbandictionary',
  description: string('urbanDictionary', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'urbanDictionary <word>',
  example: [ 'urbanDictionary pineapple' ]
};
