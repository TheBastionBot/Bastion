/**
 * @file playlist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const jsonDB = require('node-json-db');
const db = new jsonDB('./data/playlist', true, true);

exports.exec = (Bastion, message, args) => {
  if (!args.song) {
    db.reload();
    let title = 'Saved Playlists', playlist = db.getData('/');

    if (!args.playlist) {
      playlist = Object.keys(playlist);
    }
    else {
      title = 'Saved Songs';
      playlist = playlist[args.playlist.join(' ')];
    }

    if (playlist && playlist.length !== 0) {
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: title,
          description: playlist.join('\n')
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'song/playlist'), message.channel);
    }
  }
  else {
    args.song = args.song.join(' ');
    args.playlist = args.playlist ? args.playlist.join(' ') : 'default';

    db.reload();
    db.push(`/${args.playlist}`, [ args.song ], false);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added to playlist',
        fields: [
          {
            name: 'Song',
            value: args.song
          },
          {
            name: 'Playlist',
            value: args.playlist
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true },
    { name: 'playlist', type: String, multiple: true, alias: 'p' }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'playlist',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'playlist [Song Name] [-p Playlist Name]',
  example: [ 'playlist', 'playlist -p Jazz Collection', 'playlist Shape of You -p My Favs', 'playlist https://www.youtube.com/watch?v=JGwWNGJdvx8' ]
};
