/**
 * @file summon command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  let voiceChannel;
  if (Bastion.credentials.ownerId.includes(message.author.id)) {
    voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', `${message.author.tag} you need to be in a voice channel.`, message.channel);
    }
    if (voiceChannel.joinable) {
      voiceChannel.join().then(connection => {
        message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
          Bastion.log.error(e.stack);
        });
        if (!voiceChannel.speakable) {
          voiceChannel.leave();
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', 'No Permissions', 'I don\'t have permissions to speak in this channel.', message.channel);
        }
        else if (!connection.speaking) {
          connection.playFile('./data/greeting.mp3', { passes: 1 });
        }
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', 'No Permissions', `I don't have permissions to join the **${voiceChannel.name}** voice channel.`, message.channel);
    }
  }
  else {
    Bastion.db.get(`SELECT musicMasterRoleID, musicTextChannelID, musicVoiceChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(musicChannel => {
      if (musicChannel.musicMasterRoleID) {
        if (message.member.roles.has(musicChannel.musicMasterRoleID)) {
          voiceChannel = message.member.voiceChannel;
          if (!voiceChannel) {
            /**
             * Error condition is encountered.
             * @fires error
             */
            return Bastion.emit('error', '', `${message.author.tag} you need to be in a voice channel.`, message.channel);
          }
          if (voiceChannel.joinable) {
            voiceChannel.join().then(connection => {
              message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
                Bastion.log.error(e.stack);
              });
              if (!voiceChannel.speakable) {
                voiceChannel.leave();
                /**
                 * Error condition is encountered.
                 * @fires error
                 */
                return Bastion.emit('error', 'No Permissions', 'I don\'t have permissions to speak in this channel.', message.channel);
              }
              else if (!connection.speaking) {
                connection.playFile('./data/greeting.mp3', { passes: 1 });
              }
            });
          }
          else {
            /**
             * Error condition is encountered.
             * @fires error
             */
            return Bastion.emit('error', 'No Permissions', `I don't have permissions to join the **${voiceChannel.name}** voice channel.`, message.channel);
          }
        }
      }
      else {
        if (musicChannel.musicTextChannelID !== message.channel.id) return;
        if (!musicChannel.musicVoiceChannelID) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', 'No Permissions', 'No default music channel has been set. So, only the bot owner can use this command.', message.channel);
        }
        if (!(voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(musicChannel.musicVoiceChannelID))) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', 'Invalid Data', 'I am not able to join the default voice channel. Either a wrong voice channel has been set or the voice channel has been deleted.', message.channel);
        }
        if (voiceChannel.joinable) {
          voiceChannel.join().then(connection => {
            message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
              Bastion.log.error(e.stack);
            });
            if (!voiceChannel.speakable) {
              voiceChannel.leave();
              /**
               * Error condition is encountered.
               * @fires error
               */
              return Bastion.emit('error', 'No Permissions', 'I don\'t have permissions to speak in this channel.', message.channel);
            }
            else if (!connection.speaking) {
              connection.playFile('./data/greeting.mp3', { passes: 1 });
            }
          });
        }
        else {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', 'No Permissions', `I don't have permissions to join the **${voiceChannel.name}** voice channel.`, message.channel);
        }
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
  description: string('summon', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'summon',
  example: []
};
