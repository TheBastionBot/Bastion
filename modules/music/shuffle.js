/**
 * @file shuffle command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  if (message.guild.music.textChannelID && message.channel.id !== message.guild.music.textChannelID) return Bastion.log.info('Music channels have been set, so music commands will only work in the music text channel.');

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'emptyQueue'), Bastion.strings.error(message.guild.language, 'notPlaying', true), message.channel);
  }

  let nowPlaying = message.guild.music.songs.shift();
  message.guild.music.songs = shuffle(message.guild.music.songs);
  message.guild.music.songs.unshift(nowPlaying);
  // message.guild.music.songs.shuffle();

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'Shuffled the queue.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'shuffle',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shuffle',
  example: []
};

/**
 * Shuffles an array.
 * @function shuffle
 * @param {array} array The array to shuffle.
 * @returns {array} The shuffled array.
 */
function shuffle(array) {
  let i = array.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = array[--i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}
