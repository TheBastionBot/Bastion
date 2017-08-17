/**
 * @file pause command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('emptyQueue', 'errors'), string('notPlaying', 'errorMessage'), message.channel);
  }

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRoleID)) {
    /**
    * User has missing permissions.
    * @fires userMissingPermissions
    */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!message.guild.voiceConnection.speaking) return;

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.ORANGE,
      title: 'Paused Playback',
      description: message.guild.music.songs[0].title,
      footer: {
        text: `🔉 ${message.guild.music.dispatcher.volume * 50}% | ${Math.floor(message.guild.music.dispatcher.time / 60000)}:${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)}` : Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)} / ${message.guild.music.songs[0].duration}`
      }
    }
  }).then(() => {
    message.guild.music.dispatcher.pause();
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'pause',
  description: string('pause', 'commandDescription'),
  botPermission: '',
  userPermission: 'MUSIC_MASTER',
  usage: 'pause',
  example: []
};
