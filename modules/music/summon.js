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
      return Bastion.emit('error', '', string('userNoVC', 'errorMessage', message.author.tag), message.channel);
    }
    if (voiceChannel.joinable) {
      voiceChannel.join().then(connection => {
        message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
          Bastion.log.error(e);
        });
        if (!voiceChannel.speakable) {
          voiceChannel.leave();
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'speak', `in ${voiceChannel.name}`), message.channel);
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
      return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'join', voiceChannel.name), message.channel);
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
            return Bastion.emit('error', '', string('userNoVC', 'errorMessage', message.author.tag), message.channel);
          }
          if (voiceChannel.joinable) {
            voiceChannel.join().then(connection => {
              message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
                Bastion.log.error(e);
              });
              if (!voiceChannel.speakable) {
                voiceChannel.leave();
                /**
                 * Error condition is encountered.
                 * @fires error
                 */
                return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'speak', `in ${voiceChannel.name}`), message.channel);
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
            return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'join', voiceChannel.name), message.channel);
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
          return Bastion.emit('error', string('forbidden', 'errors'), string('musicChannelNotFound', 'errorMessage'), message.channel);
        }
        if (!(voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(musicChannel.musicVoiceChannelID))) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', string('forbidden', 'errors'), string('invalidMusicChannel', 'errorMessage'), message.channel);
        }
        if (voiceChannel.joinable) {
          voiceChannel.join().then(connection => {
            message.guild.members.get(Bastion.user.id).setDeaf(true).catch(e => {
              Bastion.log.error(e);
            });
            if (!voiceChannel.speakable) {
              voiceChannel.leave();
              /**
               * Error condition is encountered.
               * @fires error
               */
              return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'speak', `in ${voiceChannel.name}`), message.channel);
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
          return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'join', voiceChannel.name), message.channel);
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
