/**
 * @file play command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const util = xrequire('util');
const youtubeDL = xrequire('youtube-dl');
const getSongInfo = util.promisify(youtubeDL.getInfo);

exports.exec = async (Bastion, message, args) => {
  try {
    if (!message.guild.music.enabled) {
      if (Bastion.user.id === '267035345537728512') {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
      }
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
    }

    if (message.guild.music.textChannelID && message.guild.music.textChannelID !== message.channel.id) {
      return Bastion.log.info('Music channels have been set, so music commands will only work in the Music Text Channel.');
    }


    if (!args.song && !args.playlist) {
      return Bastion.emit('commandUsage', message, this.help);
    }


    let voiceConnection = message.guild.voiceConnection, voiceChannel, textChannel, vcStats;

    if (voiceConnection) {
      voiceChannel = voiceConnection.channel;
      textChannel = message.guild.music.textChannel || message.channel;

      vcStats = Bastion.i18n.error(message.guild.language, 'userNoSameVC', message.author.tag);
    }
    else {
      if (message.guild.music.textChannelID && message.guild.music.voiceChannelID) {
        voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
        textChannel = message.guild.channels.filter(c => c.type === 'text').get(message.guild.music.textChannelID);

        if (!voiceChannel || !textChannel) {
          return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidMusicChannel'), message.channel);
        }

        vcStats = Bastion.i18n.error(message.guild.language, 'userNoMusicChannel', message.author.tag, voiceChannel.name);
      }
      else if (Bastion.credentials.ownerId.includes(message.author.id) || message.member.roles.has(message.guild.music.masterRoleID)) {
        voiceChannel = message.member.voiceChannel;
        textChannel = message.channel;

        if (!voiceChannel) {
          return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'userNoVC', message.author.tag), message.channel);
        }
      }
      else {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicChannelNotFound'), message.channel);
      }

      if (!voiceChannel.joinable) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noPermission', 'join', voiceChannel.name), message.channel);
      }

      voiceConnection = await voiceChannel.join();
    }


    if (!voiceChannel.speakable) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noPermission', 'speak', `in ${voiceChannel.name}`), message.channel);
    }
    if (textChannel.id !== message.channel.id) {
      return Bastion.log.info(`Music commands will only work in the ${textChannel.name} text channel for this session.`);
    }
    if (!voiceChannel.members.get(message.author.id)) {
      return Bastion.emit('error', '', vcStats, message.channel);
    }

    message.guild.me.setMute(false).catch(() => {});
    message.guild.me.setDeaf(true).catch(() => {});


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

    if (args.playlist) {
      // Bastion Playlist
      let playlistModel = await Bastion.database.models.playlist.findOne({
        attributes: [ 'songs' ],
        where: {
          guildID: message.guild.id,
          name: message.author.id,
          creator: message.author.id
        }
      });

      if (!playlistModel || !playlistModel.dataValues.songs.length) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'playlistNotFound'), message.channel);
      }

      let songs = playlistModel.dataValues.songs;

      for (let song of songs) {
        song.requester = message.author.tag;
        message.guild.music.songs.push(song);
      }

      await message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Added ${songs.length} songs to the queue from your playlist.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let playlist = false;
      args.song = args.song.join(' ');
      if (/^http[s]?:[/]{2}(?:www\.)?youtube\.com\/(?:(?:playlist|watch)\?(?:[a-z0-9-_=&.]{1,2021})?list=[a-z0-9-_]{1,64}(?:[a-z0-9-_=&.]{1,2021})?)$/i.test(args.song)) {
        // YouTube Playlist
        playlist = true;
      }

      let songURL = /^http[s]?:[/]{2}(?:[a-z0-9](?:[a-zA-Z0-9-]{0,249}(?:[a-zA-Z0-9]))?\.?){1,127}[-a-z0-9@:%_+.~#?&/=]{0,2045}$/i.test(args.song) ? args.song : `ytsearch:${args.song}`;

      let youtubeDLOptions = [
        '--quiet',
        '--ignore-errors',
        '--simulate',
        '--no-warnings',
        '--force-ipv4',
        '--format=bestaudio[protocol^=http]',
        `--user-agent=BastionDiscordBot/v${Bastion.package.version} (https://bastion.traction.one)`,
        '--referer=https://bastion.traction.one',
        '--youtube-skip-dash-manifest'
      ];

      let songInfo = await getSongInfo(
        songURL,
        playlist ? [ '--flat-playlist', '--yes-playlist' ].concat(youtubeDLOptions) : youtubeDLOptions
      );

      if (!songInfo || (!playlist && (!songInfo.format_id || songInfo.format_id.startsWith('0')))) {
        Bastion.log.error(songInfo);
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'result'), message.channel);
      }

      if (playlist) {
        songInfo.forEach(song => {
          message.guild.music.songs.push({
            url: `https://www.youtube.com/watch?v=${song.id}`,
            id: song.id,
            title: song.title,
            thumbnail: '',
            duration: 'N/A',
            requester: message.author.tag
          });
        });

        await message.channel.send({
          embed: {
            color: Bastion.colors.GREEN,
            description: `Added ${songInfo.length} songs to the queue from the YouTube playlist.`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      else {
        message.guild.music.songs.push({
          url: songInfo.url,
          id: songInfo.id,
          title: songInfo.title,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.duration,
          requester: message.author.tag
        });

        await textChannel.send({
          embed: {
            color: Bastion.colors.GREEN,
            title: 'Added to the queue',
            url: songInfo.id ? `https://youtu.be/${songInfo.id}` : '',
            description: songInfo.title,
            thumbnail: {
              url: songInfo.thumbnail
            },
            footer: {
              text: `Position: ${message.guild.music.songs.length} • Duration: ${songInfo.duration || 'N/A'} • Requester: ${message.author.tag}`
            }
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    }


    if (!message.guild.music.playing) {
      await startStreamDispatcher(message.guild, voiceConnection);
    }

    voiceConnection.on('error', Bastion.log.error);
    voiceConnection.on('failed', Bastion.log.error);
  }
  catch (e) {
    Bastion.log.error(e);
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'result'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'song', type: String, multiple: true, defaultOption: true },
    { name: 'playlist', type: Boolean, alias: 'p' }
  ]
};

exports.help = {
  name: 'play',
  description: 'Plays a song or adds the song to the current music queue if Bastion is already playing in your Discord server, specified either by the name, or the link, or from your favorite songs list, or from a YouTube playlist link.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'play < SONG NAME | SONG_LINK | YOUTUBE_PLAYLIST_LINK | --playlist >',
  example: [ 'play Shape of you', 'play https://www.youtube.com/watch?v=fNVUTgd4pio', 'play --playlist' ]
};

/**
 * Starts a Stream Dispatcher in the specified guild
 * @function startStreamDispatcher
 * @param {Guild} guild the guild object where this command was ran
 * @param {VoiceConnection} connection the VoiceConnection of Bastion in this guild
 * @returns {void}
 */
async function startStreamDispatcher(guild, connection) {
  if (!guild.music.songs[0] && guild.music.autoPlay && connection.channel.members.size > 1) {
    let songs = await guild.client.methods.makeBWAPIRequest('/google/youtube/topsongs/today');
    let videoID = songs.getRandom();

    let youtubeDLOptions = [
      '--quiet',
      '--ignore-errors',
      '--simulate',
      '--no-warnings',
      '--force-ipv4',
      '--format=bestaudio[protocol^=http]',
      '--user-agent=BastionDiscordBot (https://bastion.traction.one)',
      '--referer=https://bastion.traction.one',
      '--youtube-skip-dash-manifest'
    ];

    let songInfo = await getSongInfo(`https://youtu.be/${videoID}`, youtubeDLOptions);

    if (!songInfo) {
      return guild.client.emit('error', '', guild.client.i18n.error(guild.language, 'notFound', 'result'), guild.music.textChannel);
    }

    guild.music.songs.push({
      url: songInfo.url,
      id: songInfo.id,
      title: songInfo.title,
      thumbnail: songInfo.thumbnail,
      duration: songInfo.duration,
      requester: guild.client.user.tag
    });
  }
  else if (!guild.music.songs[0] || connection.channel.members.size <= 1) {
    if (guild.client.configurations.music && guild.client.configurations.music.status) {
      guild.client.user.setActivity(typeof guild.client.configurations.game.name === 'string' ? guild.client.configurations.game.name : guild.client.configurations.game.name instanceof Array ? guild.client.configurations.game.name[0] : null,
        {
          type: guild.client.configurations.game.type,
          url: guild.client.configurations.game.url && guild.client.configurations.game.url.trim().length ? guild.client.configurations.game.url : null
        }
      );
    }

    let description;
    if (!guild.music.songs[0]) {
      description = 'Stopping playback.';
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
      if (guild.music.autoDisconnect) guild.music.voiceChannel.leave();
    }).catch(e => {
      guild.client.log.error(e);
    });
  }

  let stream = youtubeDL(guild.music.songs[0].url);
  let streamOptions = {
    passes: (guild.client.configurations.music && guild.client.configurations.music.passes) || 1,
    bitrate: 'auto'
  };
  guild.music.dispatcher = connection.playStream(stream, streamOptions);
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

  if (guild.client.configurations.music && guild.client.configurations.music.status) {
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
    guild.client.log.error(err);
    return startStreamDispatcher(guild, connection);
  });
}
