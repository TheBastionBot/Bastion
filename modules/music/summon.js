/**
 * @file summon command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
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
