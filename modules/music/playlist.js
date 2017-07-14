/**
 * @file addFav command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const jsonDB = require('node-json-db');
const db = new jsonDB('./data/playlist', true, true);

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.song) {
    db.reload();
    let playlist = db.getData('/');

    if (!args.playlist) {
      playlist = Object.keys(playlist);
    }
    else {
      playlist = playlist[args.playlist.join(' ')];
    }

    if (playlist && playlist.length !== 0) {
      message.channel.send({
        embed: {
          color: Bastion.colors.blue,
          title: 'Saved Playlists',
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
      return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'song/playlist'), message.channel);
    }
  }
  else {
    args.song = args.song.join(' ');
    args.playlist = args.playlist.join(' ');

    db.reload();
    db.push(`/${args.playlist}`, [ args.song ], false);

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
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
  ]
};

exports.help = {
  name: 'playlist',
  description: string('playlist', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'playlist [Song Name] [-p Playlist Name]',
  example: [ 'playlist', 'playlist -p Jazz Collection', 'playlist Shape of You -p My Favs', 'playlist https://www.youtube.com/watch?v=JGwWNGJdvx8' ]
};
