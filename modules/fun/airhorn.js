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
    if (message.guild.voiceConnection.channel !== message.member.voiceChannel) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'You need to be in the same voice channel as me to use this command.'
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
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: 'I need to be in a voice channel to be able to play an airhorn!'
    }}).then(msg => {
      msg.delete(10000).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
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
