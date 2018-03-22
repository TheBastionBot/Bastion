/**
 * @file nowPlaying command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return Bastion.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: message.guild.music.dispatcher.paused ? 'Paused' : 'Now Playing',
      url: message.guild.music.songs[0].id ? `https://youtu.be/${message.guild.music.songs[0].id}` : '',
      description: message.guild.music.songs[0].title,
      thumbnail: {
        url: message.guild.music.songs[0].thumbnail
      },
      footer: {
        text: `🔉 ${message.guild.music.dispatcher.volume * 50}% • ${Math.floor(message.guild.music.dispatcher.time / 60000)}:${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)}` : Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)} / ${message.guild.music.songs[0].duration}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'np' ],
  enabled: true
};

exports.help = {
  name: 'nowPlaying',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'nowPlaying',
  example: []
};
