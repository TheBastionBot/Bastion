/**
 * @file removeSong command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return Bastion.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
    * Error condition is encountered.
    * @fires error
    */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  if (!args.index) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (args.index >= message.guild.music.songs.length || args.index < 1) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'indexRange', true), message.channel);
  }

  let removedSong = message.guild.music.songs.splice(args.index, 1);
  removedSong = removedSong[0];

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.RED,
      title: 'Removed from the queue',
      url: removedSong.id ? `https://youtu.be/${removedSong.id}` : '',
      description: removedSong.title,
      thumbnail: {
        url: removedSong.thumbnail
      },
      footer: {
        text: `Position: ${args.index} • Requester: ${removedSong.requester}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'index', type: Number, defaultOption: true }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'removeSong',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'removeSong [index]',
  example: [ 'removeSong 3' ]
};
