/**
 * @file queue command
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

  let songs = message.guild.music.songs.slice(1);
  songs = songs.map((song, i) => `**${i + 1}.** ${song.title}`);

  let noOfPages = songs.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Music queue',
      fields: [
        {
          name: 'Now Playing',
          value: `${message.guild.music.songs[0].title}\n\n*Requested by ${message.guild.music.songs[0].requester}*`
        },
        {
          name: 'Up next',
          value: songs.slice(i * 10, (i * 10) + 10).join('\n\n') || 'Nothing\'s gonna play up next, add songs to the queue using the `play` command.'
        }
      ],
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • ${message.guild.music.songs.length - 1} songs in queue`
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
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'queue',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'queue <PAGE_NO>',
  example: [ 'queue', 'queue 2' ]
};
