/**
 * @file np command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('emptyQueue', 'errors'), string('notPlaying', 'errorMessage'), message.channel);
  }

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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'np',
  description: string('np', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'np',
  example: []
};
