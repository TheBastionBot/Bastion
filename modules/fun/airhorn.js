/**
 * @file airhorn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  try {
    if (message.deletable) {
      message.delete(1000).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    if (message.guild.voiceConnection) {
      if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userPermission)) {
        /**
        * User has missing permissions.
        * @fires userMissingPermissions
        */
        return Bastion.emit('userMissingPermissions', this.help.userPermission);
      }

      if (message.guild.voiceConnection.speaking) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('busy', 'errors'), 'I\'m already playing something in a channel. Can\'t play airhorn now.', message.channel);
      }

      if (!message.guild.voiceConnection.channel.speakable) {
        /**
         * Bastion has missing permissions.
         * @fires bastionMissingPermissions
         */
        return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
      }

      message.guild.voiceConnection.playFile('./data/airhorn.wav', { passes: 1 });
    }
    else {
      if (message.member.voiceChannel) {
        if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userPermission)) {
          /**
          * User has missing permissions.
          * @fires userMissingPermissions
          */
          return Bastion.emit('userMissingPermissions', this.help.userPermission);
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

        message.member.voiceChannel.join().then(connection => {
          const dispatcher = connection.playFile('./data/airhorn.wav', { passes: 1 });
          dispatcher.on('end', () => {
            connection.channel.leave();
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      else {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', '', 'Either one of us should be in a voice channel.', message.channel);
      }
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
  description: string('airhorn', 'commandDescription'),
  botPermission: '',
  userPermission: 'MUTE_MEMBERS',
  usage: 'airhorn',
  example: []
};
