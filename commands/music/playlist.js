/**
 * @file playlist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const util = xrequire('util');
const youtubeDL = xrequire('youtube-dl');
const getSongInfo = util.promisify(youtubeDL.getInfo);

exports.exec = async (Bastion, message, args) => {
  if (!message.guild.music.enabled) {
    if (Bastion.user.id === '267035345537728512') {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }


  if (args.song) {
    args.song = args.song.join(' ');

    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    let [ playlistModel, initialized ] = await Bastion.database.models.playlist.findOrBuild({
      where: {
        guildID: message.guild.id,
        name: message.author.id,
        creator: message.author.id
      },
      defaults: {
        songs: []
      }
    });
    if (initialized) {
      await playlistModel.save();
    }


    if (args.remove) {
      playlistModel.dataValues.songs = playlistModel.dataValues.songs.filter(song => song && song.title && !song.title.toLowerCase().includes(args.song.toLowerCase()));
    }
    else {
      let songURL = /^http[s]?:[/]{2}(?:[a-z0-9](?:[a-zA-Z0-9-]{0,249}(?:[a-zA-Z0-9]))?\.?){1,127}[-a-z0-9@:%_+.~#?&/=]{0,2045}$/i.test(args.song) ? args.song : `ytsearch:${args.song}`;
      let youtubeDLOptions = [
        '--quiet',
        '--ignore-errors',
        '--simulate',
        '--no-warnings',
        '--format=bestaudio[protocol^=http]',
        `--user-agent=BastionDiscordBot/v${Bastion.package.version} (https://bastionbot.org)`,
        '--referer=https://bastionbot.org',
        '--youtube-skip-dash-manifest'
      ];

      let songInfo = await getSongInfo(songURL, youtubeDLOptions);
      args.song = songInfo.title;

      playlistModel.dataValues.songs = playlistModel.dataValues.songs.concat({
        url: `https://youtu.be/${songInfo.id}`,
        id: songInfo.id,
        title: songInfo.title,
        thumbnail: songInfo.thumbnail,
        duration: songInfo.duration
      });
    }

    await message.client.database.models.playlist.update({
      songs: playlistModel.dataValues.songs
    },
    {
      where: {
        guildID: message.guild.id,
        name: message.author.id,
        creator: message.author.id
      },
      fields: [ 'songs' ]
    });


    message.channel.send({
      embed: {
        color: Bastion.colors[args.remove ? 'RED' : 'GREEN'],
        description: args.remove ? `Removed all songs, matching **${args.song}**, from your playlist.` : `Added **${args.song}** to your playlist.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
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

    let songs = playlistModel.dataValues.songs.map(song => song && song.title);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Bastion Music Playlist',
        description: songs.join('\n'),
        footer: {
          text: `Created by ${message.author.tag}`
        }
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
    { name: 'remove', type: Boolean, alias: 'r' }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'playlist',
  description: 'Add a song to a given playlist or display the list of songs in a playlist.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'playlist [ SONG NAME | SONG_LINK ] [--remove]',
  example: [ 'playlist', 'playlist Rather Be', 'playlist https://www.youtube.com/watch?v=JGwWNGJdvx8', 'playlist Symphony --remove' ]
};
