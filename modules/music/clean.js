/**
 * @file clean command
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

  message.guild.music.songs.splice(1, message.guild.music.songs.length - 1);
  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'Cleaned up the queue.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'clean',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'clean',
  example: []
};
