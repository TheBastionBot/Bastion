/**
 * @file repeat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
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

  let color, repeatStat = '';
  if (message.guild.music.repeat) {
    color = Bastion.colors.RED;
    message.guild.music.repeat = false;
    repeatStat = 'Removed the current song from repeat queue.';
  }
  else {
    color = Bastion.colors.GREEN;
    message.guild.music.repeat = true;
    repeatStat = Bastion.i18n.info(message.guild.language, 'repeatSong', message.author.tag);
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
  description: 'Adds the current song to the repeat queue, so it will repeat once again after the current playback is complete.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'repeat',
  example: []
};
