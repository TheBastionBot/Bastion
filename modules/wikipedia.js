/**
 * @file wikipedia command
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

    let options = {
      url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info|pageimages&exsentences=10&exintro=true&explaintext=true&inprop=url&pithumbsize=512&redirects=1&formatversion=2&titles=${args.join(' ')}`,
      json: true
    };

    let response = await request(options);

    let color, description = '', data = [], thumbnail = '';
    color = Bastion.colors.BLUE;
    response = response.query.pages[0];

    if (response.missing) {
      color = Bastion.colors.RED;
      description = `**${args.join(' ')}** was not found in Wikipedia.`;
    }
    else {
      data = [
        {
          name: response.title || args.join(' '),
          value: `${response.extract.length < 1000 ? response.extract : response.extract.slice(0, 950)}... [Read More](${response.fullurl})`
        }
      ];
      thumbnail = response.thumbnail ? response.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png';
    }

    message.channel.send({
      embed: {
        color: color,
        title: 'Wikipedia',
        description: description,
        fields: data,
        thumbnail: {
          url: thumbnail
        },
        footer: {
          text: 'Powered by Wikipedia'
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
  aliases: [ 'wiki' ],
  enabled: true
};

exports.help = {
  name: 'wikipedia',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wikipedia <text>',
  example: [ 'wikipedia Steve Jobs' ]
};
