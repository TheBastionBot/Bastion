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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (message.deletable) {
    message.delete(1000).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let voiceChannel;
  if (Bastion.credentials.ownerId.includes(message.author.id)) {
    voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `I can't join your voice channel <@${message.author.id}>.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    if (voiceChannel.joinable) {
      voiceChannel.join().then(connection => {
        message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
          Bastion.log.error(e.stack);
        });
        if (!voiceChannel.speakable) {
          voiceChannel.leave();
          message.channel.send({
            embed: {
              color: Bastion.colors.red,
              description: 'I don\'t have permissions to speak in this channel.'
            }
          }).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        else if (!connection.speaking) {
          connection.playFile('./data/greeting.mp3', { passes: 1 });
        }
      });
    }
    else {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `I don't have permissions to join the **${voiceChannel.name}** voice channel.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }
  else {
    sql.get(`SELECT musicTextChannelID, musicVoiceChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(musicChannel => {
      if (musicChannel.musicTextChannelID !== message.channel.id) return;
      if (!musicChannel.musicVoiceChannelID) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: 'No default music channel has been set. So, only the bot owner can use this command.'
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      if (!(voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(musicChannel.musicVoiceChannelID))) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I can't join your voice channel <@${message.author.id}>.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      if (voiceChannel.joinable) {
        voiceChannel.join().then(connection => {
          message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
            Bastion.log.error(e.stack);
          });
          if (!voiceChannel.speakable) {
            voiceChannel.leave();
            message.channel.send({
              embed: {
                color: Bastion.colors.red,
                description: 'I don\'t have permissions to speak in this channel.'
              }
            }).catch(e => {
              Bastion.log.error(e.stack);
            });
          }
          else if (!connection.speaking) {
            connection.playFile('./data/greeting.mp3', { passes: 1 });
          }
        });
      }
      else {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I don't have permissions to join the **${voiceChannel.name}** voice channel.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    });
  }
};

exports.config = {
  aliases: [ 'join' ],
  enabled: true
};

exports.help = {
  name: 'summon',
  description: 'Tells the BOT to join the default voice channel (if any), set by the BOT owner. Doesn\'t apply to BOT owner.',
  botPermission: '',
  userPermission: '',
  usage: 'summon',
  example: []
};
