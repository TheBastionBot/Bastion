/**
 * @file volume command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.guild.music) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  if (message.channel.id !== message.guild.music.textChannel.id) return;

  if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    /**
    * User has missing permissions.
    * @fires userMissingPermissions
    */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  let color = Bastion.colors.GREEN;
  if (args[0] === '+') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 + 2) / 50);
  }
  else if (args[0] === '-') {
    message.guild.voiceConnection.dispatcher.setVolume((message.guild.voiceConnection.dispatcher.volume * 50 - 2) / 50);
  }
  else if (/^\d+$/.test(args[0])) {
    args = args[0] > 0 && args[0] < 100 ? args[0] : 100;
    message.guild.voiceConnection.dispatcher.setVolume(args / 50);
  }
  else {
    color = Bastion.colors.BLUE;
  }

  message.guild.music.textChannel.send({
    embed: {
      color: color,
      description: `Volume: ${Math.round(message.guild.voiceConnection.dispatcher.volume * 50)}%`
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
  name: 'volume',
  botPermission: '',
  userTextPermission: 'MUSIC_MASTER',
  usage: 'volume < + | - | amount >',
  example: [ 'volume +', 'volume -', 'volume 25' ]
};
