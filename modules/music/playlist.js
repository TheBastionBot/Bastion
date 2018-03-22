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
    let title = 'Saved Playlists', color = Bastion.colors.BLUE, playlist = db.getData('/');

    if (!args.playlist) {
      playlist = Object.keys(playlist);
    }
    else {
      if (args.remove) {
        db.delete(`/${args.playlist.join(' ')}`);
        title = 'Deleted Playlist';
        color = Bastion.colors.RED;
        playlist = [ args.playlist.join(' ') ];
      }
      else {
        title = 'Saved Songs';
        playlist = playlist[args.playlist.join(' ')];
      }
    }

    if (playlist && playlist.length !== 0) {
      message.channel.send({
        embed: {
          color: color,
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
    { name: 'playlist', type: String, multiple: true, alias: 'p' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'playlist',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'playlist [Song Name] [ -p Playlist Name [ --remove ] ]',
  example: [ 'playlist', 'playlist -p Jazz Collection', 'playlist -p Jazz Collection --remove', 'playlist Shape of You -p My Favs', 'playlist https://www.youtube.com/watch?v=JGwWNGJdvx8' ]
};
