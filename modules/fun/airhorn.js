/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = (Bastion, message, args) => {
  if (message.deletable) {
    message.delete(1000).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (message.guild.voiceConnection) {
    if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has('MUTE_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
    if (message.guild.voiceConnection.speaking) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'I\'m already playing something in a channel. Can\'t play airhorn now.'
      }}).then(msg => {
        msg.delete(10000).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    if (!message.guild.voiceConnection.channel.speakable) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'I don\'t have permission to speak in this voice channel.'
      }}).then(msg => {
        msg.delete(10000).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.guild.voiceConnection.playFile('./data/airhorn.wav', { passes: 1 });
  }
  else {
    if (message.member.voiceChannel) {
      if (!message.member.voiceChannel.permissionsFor(message.member).has('MUTE_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
      if (!message.member.voiceChannel.joinable) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: 'I don\'t have permission to join this voice channel.'
        }}).then(msg => {
          msg.delete(10000).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      if (!message.member.voiceChannel.speakable) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: 'I don\'t have permission to speak in this voice channel.'
        }}).then(msg => {
          msg.delete(10000).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      if (message.member.voiceChannel.full) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: 'This voice channel is currently full. Try playing airhorn later.'
        }}).then(msg => {
          msg.delete(10000).catch(e => {
            Bastion.log.error(e.stack);
          });
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
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
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'Either you or me needs to be in a voice channel to use this command.'
      }}).then(msg => {
        msg.delete(10000).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }
};

exports.config = {
  aliases: ['horn'],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn in the current voice channel.',
  botPermission: '',
  userPermission: 'Mute Members',
  usage: 'airhorn',
  example: []
};
