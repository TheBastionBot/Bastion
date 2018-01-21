/**
 * @file twitch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.live) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'Client-ID': Bastion.credentials.twitchClientID,
        'Accept': 'Accept: application/vnd.twitchtv.v3+json'
      },
      url: `https://api.twitch.tv/kraken/streams/${args.live}`,
      json: true
    };
    let response = await request(options);

    let author, fields, image, footer;

    if (response.stream === null) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'noLiveStream', true, args.live), message.channel);
    }

    author = {
      name: response.stream.channel.display_name,
      url: response.stream.channel.url,
      icon_url: response.stream.channel.logo
    };
    fields = [
      {
        name: 'Game',
        value: response.stream.game,
        inline: true
      },
      {
        name: 'Viewers',
        value: response.stream.viewers,
        inline: true
      }
    ];
    image = {
      url: response.stream.preview.large
    };
    footer = {
      text: '🔴 Live'
    };

    message.channel.send({
      embed: {
        color: Bastion.colors.PURPLE,
        author: author,
        title: response.stream.channel.status,
        url: response.stream.channel.url,
        fields: fields,
        image: image,
        footer: footer,
        timestamp: new Date(response.stream.created_at)
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
  enabled: true,
  argsDefinitions: [
    { name: 'live', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'twitch',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'twitch <username>',
  example: [ 'twitch k3rn31p4nic' ]
};
