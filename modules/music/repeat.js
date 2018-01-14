/**
 * @file repeat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return;

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
    repeatStat = 'Added the current song to the repeat queue.';
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
  aliases: [],
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
