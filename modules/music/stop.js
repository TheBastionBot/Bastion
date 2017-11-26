/**
 * @file stop command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  if (message.channel.id !== message.guild.music.textChannelID) return;

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    /**
    * User has missing permissions.
    * @fires userMissingPermissions
    */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.RED,
      description: 'Stopped Playback.'
    }
  }).then(() => {
    if (message.guild.music) {
      message.guild.music.songs = [];
    }
    message.guild.music.dispatcher.end();
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'stop',
  botPermission: '',
  userTextPermission: 'MUSIC_MASTER',
  userVoicePermission: '',
  usage: 'stop',
  example: []
};
