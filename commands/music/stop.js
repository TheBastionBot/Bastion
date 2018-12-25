/**
 * @file stop command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (!message.guild.music.enabled) {
    if (Bastion.user.id === '267035345537728512') {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  if (message.guild.music.textChannelID && message.guild.music.textChannelID !== message.channel.id) {
    return Bastion.log.info('Music channels have been set, so music commands will only work in the Music Text Channel.');
  }

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notPlaying'), message.channel);
  }

  if (message.guild.music) {
    message.guild.music.songs = [];
    await message.guild.music.dispatcher.end();
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'stop',
  description: 'Stops the current playback and cleans the music queue and exits the voice channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stop',
  example: []
};
