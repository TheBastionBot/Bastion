/**
 * @file volume command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
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
  if (args.value && args.value <= 200) {
    message.guild.voiceConnection.dispatcher.setVolume(args.value / 50);
  }
  else {
    color = Bastion.colors.BLUE;
  }

  await message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: `Volume: ${message.guild.voiceConnection.dispatcher.volume * 50}%`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'vol' ],
  enabled: true,
  musicMasterOnly: true,
  argsDefinitions: [
    { name: 'value', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'volume',
  description: 'Changes the volume of current playback in your server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'volume <VALUE>',
  example: [ 'volume 25' ]
};
