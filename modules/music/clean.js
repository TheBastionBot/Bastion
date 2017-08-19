/**
 * @file clean command
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

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    /**
    * User has missing permissions.
    * @fires userMissingPermissions
    */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  message.guild.music.songs.splice(1, message.guild.music.songs.length - 1);
  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'Cleaned up the queue.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'clean',
  description: string('clean', 'commandDescription'),
  botPermission: '',
  userPermission: 'MUSIC_MASTER',
  usage: 'clean',
  example: []
};
