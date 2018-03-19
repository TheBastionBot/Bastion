/**
 * @file giphy command
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
      url: 'http://api.giphy.com/v1/gifs/search',
      qs: {
        q: encodeURI(args.join('+')),
        api_key: 'dc6zaTOxFJmzC',
        limit: 10,
        offset: 0
      },
      json: true
    };

    let response = await request(options);

    if (response.data.length) {
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: `GIF Search for ${args.join(' ')}`.slice(0, 256),
          image: {
            url: response.data[Math.floor(Math.random() * response.data.length)].images.original.url
          },
          footer: {
            text: 'Powered by GIPHY'
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'image'), message.channel);
    }
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'gif' ],
  enabled: true
};

exports.help = {
  name: 'giphy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giphy <query>',
  example: [ 'giphy iron man' ]
};
