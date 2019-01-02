/**
 * @file topGames command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (!message.guild.activities || !message.guild.activities.games) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'I don\'t have enough data to show anything useful.',
        description: 'It looks like gaming activity in this server is a little light. Wait for people to start playing some games and check back later!'
      }
    });
  }

  let gameStats = [];

  let topPlayedGames = Object.entries(message.guild.activities.games);
  topPlayedGames = topPlayedGames.sort((a, b) => b.tail().length - a.tail().length);
  topPlayedGames = topPlayedGames.slice(0, 10);

  for (let game of topPlayedGames) {
    gameStats.push({
      name: game.head(),
      value: `${game.tail().length} players`
    });
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Most played games in this Server',
      fields: gameStats,
      footer: {
        text: 'Game activities are reset after restart.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'topGames',
  description: 'Shows the top most played games in the server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'topGames',
  example: []
};
