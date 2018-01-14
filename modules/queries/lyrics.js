/**
 * @file lyrics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  if (!args.song) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  request({
    headers: {
      'Accept': 'Accept: application/json'
    },
    uri: `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${encodeURIComponent(args.song)}&apikey=${Bastion.credentials.musixmatchAPIKey}`
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
        if (body.message.header.status_code === 200) {
          message.channel.send({
            embed: {
              color: Bastion.colors.BLUE,
              title: `${args.song.join(' ').toTitleCase()} - Lyrics`,
              description: body.message.body.lyrics.lyrics_body.replace('******* This Lyrics is NOT for Commercial use *******', `View full lyrics at [musixmatch.com](${body.message.body.lyrics.backlink_url} 'Musixmatch')`),
              footer: {
                text: `Powered by Musixmatch • Language: ${body.message.body.lyrics.lyrics_language_description.toTitleCase()}`
              }
            }
          }).catch(e => {
            Bastion.log.error(e);
          });
        }
        else if (body.message.header.status_code === 404) {
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'song lyrics'), message.channel);
        }
        // TODO: Show error messages for every status codes
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
    { name: 'song', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'lyrics',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lyrics <SONG_NAME> [Artist Name>]',
  example: [ 'lyrics Something just like this', 'lyrics Shape of you - Ed Sheeran' ]
};
