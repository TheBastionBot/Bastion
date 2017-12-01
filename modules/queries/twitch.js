/**
 * @file twitch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  if (!args.live) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  request({
    headers: {
      'Client-ID': Bastion.credentials.twitchClientID,
      'Accept': 'Accept: application/vnd.twitchtv.v3+json'
    },
    uri: `https://api.twitch.tv/kraken/streams/${args.live}`
  }, (err, response, body) => {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }
    if (response.statusCode === 200) {
      try {
        body = JSON.parse(body);
        let author, fields, image, footer;

        if (body.stream === null) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'noLiveStream', true, args.live), message.channel);
        }
        author = {
          name: body.stream.channel.display_name,
          url: body.stream.channel.url,
          icon_url: body.stream.channel.logo
        };
        fields = [
          {
            name: 'Game',
            value: body.stream.game,
            inline: true
          },
          {
            name: 'Viewers',
            value: body.stream.viewers,
            inline: true
          }
        ];
        image = {
          url: body.stream.preview.large
        };
        footer = {
          text: '🔴 Live'
        };

        message.channel.send({
          embed: {
            color: Bastion.colors.PURPLE,
            author: author,
            title: body.stream.channel.status,
            url: body.stream.channel.url,
            fields: fields,
            image: image,
            footer: footer,
            timestamp: new Date(body.stream.created_at)
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      catch (e) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'parseError'), Bastion.strings.error(message.guild.language, 'parse', true), message.channel);
      }
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', response.statusCode, response.statusMessage, message.channel);
    }
  });
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
