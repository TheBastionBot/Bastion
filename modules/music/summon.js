/**
 * @file summon command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let voiceChannel;
    if (Bastion.credentials.ownerId.includes(message.author.id) || message.member.roles.has(message.guild.music.masterRoleID)) {
      voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'userNoVC', true, message.author.tag), message.channel);
      }
    }
    else {
      if (message.guild.music.textChannelID !== message.channel.id) return Bastion.log.info('Music channels have been set, so music commands will only work in the music text channel.');

      voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
      if (!voiceChannel) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'invalidMusicChannel', true), message.channel);
      }
    }

    if (!voiceChannel.joinable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'join', voiceChannel.name), message.channel);
    }
    if (!voiceChannel.speakable) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'noPermission', true, 'speak', `in ${voiceChannel.name}`), message.channel);
    }

    let connection = await voiceChannel.join();

    message.guild.me.setMute(false).catch(() => {});
    message.guild.me.setDeaf(true).catch(() => {});

    if (!connection.speaking) {
      connection.playFile('./data/greeting.mp3', { passes: (Bastion.config.music && Bastion.config.music.passes) || 1, bitrate: 'auto' });
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
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'summon',
  example: []
};
