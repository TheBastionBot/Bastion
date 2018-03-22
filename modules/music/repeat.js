/**
 * @file repeat command
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

  let color, repeatStat = '';
  if (message.guild.music.repeat) {
    color = Bastion.colors.RED;
    message.guild.music.repeat = false;
    repeatStat = 'Removed the current song from repeat queue.';
  }
  else {
    color = Bastion.colors.GREEN;
    message.guild.music.repeat = true;
    repeatStat = Bastion.strings.info(message.guild.language, 'repeatSong', message.author.tag);
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: repeatStat
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'loop' ],
  enabled: true
};

exports.help = {
  name: 'repeat',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'repeat',
  example: []
};
