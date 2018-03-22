/**
 * @file lyrics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.song) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'Accept': 'Accept: application/json'
      },
      url: `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${encodeURIComponent(args.song)}&apikey=${Bastion.credentials.musixmatchAPIKey}`,
      json: true
    };
    let response = await request(options);

    if (response.message.header.status_code === 200) {
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: `${args.song.join(' ').toTitleCase()} - Lyrics`,
          description: response.message.body.lyrics.lyrics_body.replace('******* This Lyrics is NOT for Commercial use *******', `View full lyrics at [musixmatch.com](${response.message.body.lyrics.backlink_url} 'Musixmatch')`),
          footer: {
            text: `Powered by Musixmatch • Language: ${response.message.body.lyrics.lyrics_language_description.toTitleCase()}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (response.message.header.status_code === 404) {
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          title: 'Not Found',
          description: `No lyrics was found for **${args.song.join(' ').toTitleCase()}**.\nIf you think you are searching for the right song, try adding the artist's name to the search term and try again.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
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
