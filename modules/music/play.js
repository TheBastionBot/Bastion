/**
 * @file play command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const yt = require('youtube-dl');
const jsonDB = require('node-json-db');
const db = new jsonDB('./data/playlist', true, true);

exports.exec = (Bastion, message, args) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return Bastion.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!args.song && !args.ytpl && !args.playlist) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let voiceChannel, textChannel, vcStats;
  if (message.guild.voiceConnection) {
    voiceChannel = message.guild.voiceConnection.channel;
    textChannel = message.channel;
    vcStats = Bastion.strings.error(message.guild.language, 'userNoSameVC', true, message.author.tag);
  }
  else if (message.guild.music.textChannelID && message.guild.music.voiceChannelID) {
    if (!(voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID)) || !(textChannel = message.guild.channels.filter(c => c.type === 'text').get(message.guild.music.textChannelID))) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidMusicChannel', true), message.channel);
    }
    if (!voiceChannel.joinable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
    }
    if (!voiceChannel.speakable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
    }
    vcStats = Bastion.strings.error(message.guild.language, 'userNoMusicChannel', true, message.author.tag, voiceChannel.name);
  }
  else {
    /**
    * Error condition is encountered.
    * @fires error
    */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'musicChannelNotFound', true), message.channel);
  }

  if (textChannel.id !== message.channel.id) return Bastion.log.info(`Music commands will only work in ${textChannel.name} for this session.`);
  if (voiceChannel.members.get(message.author.id) === undefined) {
    /**
    * Error condition is encountered.
    * @fires error
    */
    return Bastion.emit('error', '', vcStats, message.channel);
  }

  message.guild.music.voiceChannel = voiceChannel;
  message.guild.music.textChannel = textChannel;

  if (!message.guild.music.hasOwnProperty('songs')) {
    message.guild.music.songs = [];
  }
  if (!message.guild.music.hasOwnProperty('playing')) {
    message.guild.music.playing = false;
  }
  if (!message.guild.music.hasOwnProperty('repeat')) {
    message.guild.music.repeat = false;
  }
  if (!message.guild.music.hasOwnProperty('skipVotes')) {
    message.guild.music.skipVotes = [];
  }

  let song = '';
  try {
    if (args.song) {
      song = args.song.join(' ');
    }
    else if (args.ytpl) {
      if (!/^(http[s]?:\/\/)?(www\.)?youtube\.com\/playlist\?list=([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args.ytpl)) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'YouTube Playlist URL'), textChannel);
      }
      message.channel.send({
        embed: {
          description: 'Processing playlist...'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      yt.getInfo(args.ytpl, [ '-q', '-i', '--skip-download', '--no-warnings', '--flat-playlist', '--format=bestaudio[protocol^=http]' ], (err, info) => {
        if (err) {
          Bastion.log.error(err);
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), textChannel);
        }
        if (info) {
          if (info.length === 0) {
            /**
            * Error condition is encountered.
            * @fires error
            */
            return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'playlistNotFound', true), textChannel);
          }
          song = info.shift().title;
          message.channel.send({
            embed: {
              description: `Adding ${info.length} songs to the queue...`
            }
          }).catch(e => {
            Bastion.log.error(e);
          });
          // TODO: This executes before `args` is added to the queue, so the first song (`args`) is added later in the queue. Using setTimeout or flags is inefficient, find an efficient way to fix this!
          info.forEach(e => {
            message.guild.music.songs.push({
              url: `https://www.youtube.com/watch?v=${e.url}`,
              id: e.url,
              title: e.title,
              thumbnail: '',
              duration: e.duration,
              requester: message.author.tag
            });
          });
        }
      });
    }
    else if (args.playlist) {
      let playlist;

      db.reload();
      playlist = db.getData('/');
      playlist = playlist[args.playlist.join(' ')];

      if (!playlist || playlist.length === 0) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'song/playlist'), textChannel);
      }

      song = playlist.shift();

      message.channel.send({
        embed: {
          description: `Adding ${playlist.length + 1} favourite songs to the queue...`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      // TODO: This executes before `args` is added to the queue, so the first song (`args`) is added later in the queue. Using setTimeout or flags is inefficient, find an efficient way to fix this!
      playlist.forEach(e => {
        e = /^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(e) ? e : `ytsearch:${e}`;
        yt.getInfo(e, [ '-q', '-i', '--skip-download', '--no-warnings', '--format=bestaudio[protocol^=http]' ], (err, info) => {
          if (err || info.format_id === undefined || info.format_id.startsWith('0')) return;
          message.guild.music.songs.push({
            url: info.formats[info.formats.length - 1].url,
            id: info.id,
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            requester: message.author.tag
          });
        });
      });
    }
    else return;

    song = /^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(song) ? song : `ytsearch:${song}`;

    yt.getInfo(song, [ '-q', '-i', '--skip-download', '--no-warnings', '--format=bestaudio[protocol^=http]' ], (err, info) => {
      if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            description: Bastion.strings.error(message.guild.language, 'notFound', true, 'result')
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }

      message.guild.music.songs.push({
        url: info.formats[info.formats.length - 1].url,
        id: info.id,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        requester: message.author.tag
      });
      textChannel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Added to the queue',
          url: info.id ? `https://youtu.be/${info.id}` : '',
          description: info.title,
          thumbnail: {
            url: info.thumbnail
          },
          footer: {
            text: `Position: ${message.guild.music.songs.length} • Duration: ${info.duration || 'N/A'} • Requester: ${message.author.tag}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
      if (message.guild.music && message.guild.music.playing) return;

      voiceChannel.join().then(connection => {
        message.guild.me.setDeaf(true).catch(() => {});

        startStreamDispatcher(message.guild, connection);
      }).catch(e => {
        Bastion.log.error(e);
      });
    });
  }
  catch (e) {
    Bastion.log.error(e);
    /**
    * Error condition is encountered.
    * @fires error
    */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'unknown'), Bastion.strings.error(message.guild.language, 'unknown', true), textChannel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true },
    { name: 'ytpl', type: String, alias: 'l' },
    { name: 'playlist', type: String, multiple: true, alias: 'p', defaultValue: [ 'default' ] }
  ]
};

exports.help = {
  name: 'play',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'play < name | song_link | -l <playlist_link> | -p [Playlist Name] >',
  example: [ 'play Shape of you', 'play -l https://www.youtube.com/playlist?list=PL4zQ6RXLMCJx4RD3pyzRX4QYFubtCdn_k', 'play -p My Favs', 'play -p' ]
};

/**
 * Starts a Stream Dispatcher in the specified guild
 * @function startStreamDispatcher
 * @param {Guild} guild the guild object where this command was ran
 * @param {VoiceConnection} connection the VoiceConnection of Bastion in this guild
 * @returns {void}
 */
function startStreamDispatcher(guild, connection) {
  if ((connection.channel && connection.channel.members.size < 2) || guild.music.songs[0] === undefined) {
    if (guild.client.config.music && guild.client.config.music.status) {
      guild.client.user.setActivity(typeof guild.client.config.game.name === 'string' ? guild.client.config.game.name : guild.client.config.game.name.length ? guild.client.config.game.name[0] : null,
        {
          type: guild.client.config.game.type,
          url: guild.client.config.game.url && guild.client.config.game.url.trim().length ? guild.client.config.game.url : null
        }
      );
    }

    let description;
    if (guild.music.songs[0] === undefined) {
      description = 'Exiting voice channel.';
    }
    else {
      guild.music.songs = [];
      description = 'It appears I\'ve been by myself in this voice channel since the last song. The bandwidth patrol has asked me to stop the playback to save bandwidth. That stuff doesn\'t grow on trees!';
    }

    return guild.music.textChannel.send({
      embed: {
        color: guild.client.colors.RED,
        description: description
      }
    }).then(() => {
      guild.music.dispatcher.end();
      guild.music.voiceChannel.leave();
    }).catch(e => {
      guild.client.log.error(e);
    });
  }

  guild.music.dispatcher = connection.playStream(yt(guild.music.songs[0].url), { passes: (guild.client.config.music && guild.client.config.music.passes) || 1, bitrate: 'auto' });
  guild.music.playing = true;

  guild.music.textChannel.send({
    embed: {
      color: guild.client.colors.BLUE,
      title: 'Playing',
      url: guild.music.songs[0].id ? `https://youtu.be/${guild.music.songs[0].id}` : '',
      description: guild.music.songs[0].title,
      thumbnail: {
        url: guild.music.songs[0].thumbnail
      },
      footer: {
        text: `🔉 ${guild.music.dispatcher.volume * 50}% • Duration: ${guild.music.songs[0].duration || 'N/A'} • Requester: ${guild.music.songs[0].requester}`
      }
    }
  }).catch(e => {
    guild.client.log.error(e);
  });

  if (guild.client.config.music && guild.client.config.music.status) {
    guild.client.user.setActivity(guild.music.songs[0].title);
  }

  guild.music.dispatcher.on('end', () => {
    guild.music.playing = false;
    guild.music.skipVotes = [];
    if (!guild.music.repeat) {
      guild.music.songs.shift();
    }
    else {
      guild.music.repeat = false;
    }
    setTimeout(() => {
      startStreamDispatcher(guild, connection);
    }, 500);
  });

  guild.music.dispatcher.on('error', (err) => {
    guild.music.playing = false;
    guild.music.songs.shift();
    startStreamDispatcher(guild, connection);
    return guild.client.log.error(err);
  });
}
