/**
 * @file nowPlaying command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  if (message.channel.id !== message.guild.music.textChannel.id) return;

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: message.guild.music.dispatcher.paused ? 'Paused' : 'Now Playing',
      description: message.guild.music.songs[0].title,
      thumbnail: {
        url: message.guild.music.songs[0].thumbnail
      },
      footer: {
        text: `🔉 ${message.guild.music.dispatcher.volume * 50}% | ${Math.floor(message.guild.music.dispatcher.time / 60000)}:${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)}` : Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)} / ${message.guild.music.songs[0].duration}`
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
  userPermission: '',
  usage: 'nowPlaying',
  example: []
};
