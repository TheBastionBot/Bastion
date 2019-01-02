/**
 * @file disconnect command
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

  message.guild.music.songs = [];

  if (message.guild.music.dispatcher) {
    message.guild.music.dispatcher.end();
  }

  if (message.guild.voiceConnection) {
    message.guild.voiceConnection.disconnect();
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: 'Disconnected from the voice connection of this server.'
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
  name: 'disconnect',
  description: 'Disconnect Bastion from any voice connection in the Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disconnect',
  example: []
};
