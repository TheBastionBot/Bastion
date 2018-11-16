/**
 * @file lyrics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!message.guild.music.enabled) {
      if (Bastion.user.id === '267035345537728512') {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
      }
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
    }

    if (!args.song) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      headers: {
        'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
      },
      url: `https://api.bastionbot.org/song/${args.song.join(' ')}`,
      json: true
    };
    let response = await request(options);

    if (response.error) {
      return await message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          title: 'Not Found',
          description: `No lyrics was found for **${args.song.join(' ').toTitleCase()}**.\nIf you think you are searching for the right song, try adding the artist's name to the search term and try again.`
        }
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: response.artist.name,
          icon_url: response.artist.image
        },
        title: response.name,
        description: response.lyrics.length > 2048
          ? `${response.lyrics.substring(0, 2045)}...`
          : response.lyrics,
        thumbnail: {
          url: response.image
        },
        footer: {
          text: 'Powered by Genius'
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
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'lyrics',
  description: 'Shows the lyrics of the specified song.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lyrics <SONG_NAME> [Artist Name>]',
  example: [ 'lyrics Something just like this', 'lyrics Shape of you - Ed Sheeran' ]
};
