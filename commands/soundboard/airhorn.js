/**
 * @file airhorn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (message.guild.voiceConnection) {
    if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (message.guild.voiceConnection.speaking) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'isSpeaking'), message.channel);
    }

    if (!message.guild.voiceConnection.channel.speakable) {
      return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    message.guild.voiceConnection.playFile('./assets/airhorn.wav', {
      passes: (Bastion.configurations.music && Bastion.configurations.music.passes) || 1,
      bitrate: 'auto'
    });
  }
  else if (message.member.voiceChannel) {
    if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (!message.member.voiceChannel.joinable) {
      return Bastion.emit('bastionMissingPermissions', 'CONNECT', message);
    }

    if (!message.member.voiceChannel.speakable) {
      return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    let connection = await message.member.voiceChannel.join();

    connection.on('error', Bastion.log.error);
    connection.on('failed', Bastion.log.error);

    const dispatcher = connection.playFile('./assets/airhorn.wav', {
      passes: (Bastion.configurations.music && Bastion.configurations.music.passes) || 1,
      bitrate: 'auto'
    });

    dispatcher.on('error', error => {
      Bastion.log.error(error);
    });

    dispatcher.on('end', () => {
      connection.channel.leave();
    });
  }
  else {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'eitherOneInVC'), message.channel);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn in a voice channel.',
  botPermission: '',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'airhorn',
  example: []
};
