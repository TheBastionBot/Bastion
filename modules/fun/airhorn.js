/**
 * @file airhorn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    if (message.guild.voiceConnection) {
      if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
      }

      if (message.guild.voiceConnection.speaking) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isSpeaking', true), message.channel);
      }

      if (!message.guild.voiceConnection.channel.speakable) {
        /**
        * Bastion has missing permissions.
        * @fires bastionMissingPermissions
        */
        return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
      }

      message.guild.voiceConnection.playFile('./data/airhorn.wav', { passes: (Bastion.config.music && Bastion.config.music.passes) || 1, bitrate: 'auto' });
    }
    else if (message.member.voiceChannel) {
      if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userTextPermission)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
      }

      if (!message.member.voiceChannel.joinable) {
        /**
        * Bastion has missing permissions.
        * @fires bastionMissingPermissions
        */
        return Bastion.emit('bastionMissingPermissions', 'CONNECT', message);
      }

      if (!message.member.voiceChannel.speakable) {
        /**
        * Bastion has missing permissions.
        * @fires bastionMissingPermissions
        */
        return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
      }

      let connection = await message.member.voiceChannel.join();
      const dispatcher = connection.playFile('./data/airhorn.wav', { passes: (Bastion.config.music && Bastion.config.music.passes) || 1, bitrate: 'auto' });

      dispatcher.on('error', error => {
        Bastion.log.error(error);
      });

      dispatcher.on('end', () => {
        connection.channel.leave();
      });
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'eitherOneInVC', true), message.channel);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  botPermission: '',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'airhorn',
  example: []
};
