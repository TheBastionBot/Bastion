/**
 * @file volume command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
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

  let color = Bastion.colors.GREEN;
  if (args[0] === '+') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 + 2) / 50);
  }
  else if (args[0] === '-') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 - 2) / 50);
  }
  else if (/^\d+$/.test(args[0])) {
    args = args[0] > 0 && args[0] < 100 ? args[0] : 100;
    message.guild.voiceConnection.dispatcher.setVolume(args / 50);
  }
  else {
    color = Bastion.colors.BLUE;
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: `Volume: ${Math.round(message.guild.voiceConnection.dispatcher.volume * 50)}%`
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
  name: 'volume',
  description: 'Changes/sets the volume of current playback in your Discord.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'volume < + | - | amount >',
  example: [ 'volume +', 'volume -', 'volume 25' ]
};
