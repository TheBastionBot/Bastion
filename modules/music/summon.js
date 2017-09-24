/**
 * @file summon command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  try {
    let voiceChannel;
    if (Bastion.credentials.ownerId.includes(message.author.id)) {
      voiceChannel = message.member.voiceChannel;

      if (!voiceChannel || voiceChannel.type !== 'voice') {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'userNoVC', true, message.author.tag), message.channel);
      }

      if (voiceChannel.joinable) {
        let connection = await voiceChannel.join();

        message.guild.members.get(Bastion.user.id).setMute(false).catch(() => {});
        message.guild.members.get(Bastion.user.id).setDeaf(true).catch(() => {});

        if (!voiceChannel.speakable) {
          voiceChannel.leave();
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
        }
        else if (!connection.speaking) {
          connection.playFile('./data/greeting.mp3', { passes: 1 });
        }
      }
      else {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
      }
    }
    else {
      let guildSettings = await Bastion.db.get(`SELECT musicMasterRole, musicTextChannel, musicVoiceChannel FROM guildSettings WHERE guildID=${message.guild.id}`);

      if (guildSettings.musicMasterRole) {
        if (message.member.roles.has(guildSettings.musicMasterRole)) {
          voiceChannel = message.member.voiceChannel;

          if (!voiceChannel) {
            /**
            * Error condition is encountered.
            * @fires error
            */
            return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'userNoVC', true, message.author.tag), message.channel);
          }

          if (voiceChannel.joinable) {
            let connection = await voiceChannel.join();

            message.guild.members.get(Bastion.user.id).setMute(false).catch(() => {});
            message.guild.members.get(Bastion.user.id).setDeaf(true).catch(() => {});

            if (!voiceChannel.speakable) {
              voiceChannel.leave();
              /**
              * Error condition is encountered.
              * @fires error
              */
              return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
            }
            else if (!connection.speaking) {
              connection.playFile('./data/greeting.mp3', { passes: 1 });
            }
          }
          else {
            /**
            * Error condition is encountered.
            * @fires error
            */
            return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
          }
        }
      }
      else {
        if (guildSettings.musicTextChannel !== message.channel.id) return;

        if (!guildSettings.musicVoiceChannel) {
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'musicChannelNotFound', true), message.channel);
        }

        if (!(voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(guildSettings.musicVoiceChannel))) {
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'invalidMusicChannel', true), message.channel);
        }

        if (voiceChannel.joinable) {
          let connection = await voiceChannel.join();

          message.guild.members.get(Bastion.user.id).setMute(false).catch(() => {});
          message.guild.members.get(Bastion.user.id).setDeaf(true).catch(() => {});

          if (!voiceChannel.speakable) {
            voiceChannel.leave();
            /**
            * Error condition is encountered.
            * @fires error
            */
            return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
          }
          else if (!connection.speaking) {
            connection.playFile('./data/greeting.mp3', { passes: 1 });
          }
        }
        else {
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
        }
      }
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'join' ],
  enabled: true
};

exports.help = {
  name: 'summon',
  botPermission: '',
  userPermission: '',
  usage: 'summon',
  example: []
};
