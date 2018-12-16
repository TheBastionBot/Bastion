/**
 * @file topSongs command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (!message.guild.activities || !message.guild.activities.songs) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'I don\'t have enough data to show anything useful.',
        description: 'It looks like song activity in this server is a little light. Wait for people to start listening to some songs and check back later!'
      }
    });
  }

  let songStats = [];

  let topPlayedSongs = Object.entries(message.guild.activities.songs);
  topPlayedSongs = topPlayedSongs.sort((a, b) => b.tail().length - a.tail().length);
  topPlayedSongs = topPlayedSongs.slice(0, 10);

  for (let song of topPlayedSongs) {
    songStats.push({
      name: song.head(),
      value: `${song.tail().length} listeners`
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Most played songs in this Server',
      fields: songStats,
      footer: {
        text: 'Song activities are reset after restart.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'topSongs',
  description: 'Shows the top most played songs, on Spotify, in the server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'topSongs',
  example: []
};
