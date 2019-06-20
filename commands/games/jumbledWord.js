/**
 * @file jumbledWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let activeChannels = [];

exports.exec = async (Bastion, message) => {
  if (activeChannels.includes(message.channel.id))  {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'isGameInUse', 'jumbled word'), message.channel);
  }

  let words = xrequire('./assets/words.json');

  let word = words.getRandom();

  let jumbledWord = word.split('').shuffle().join('');

  let question = await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      description: `Here's your jumbled word: **${jumbledWord}**\nFirst person to unscramble it within 5 minutes wins the game.`
    }
  });

  activeChannels.push(message.channel.id);

  const wordsCollector = message.channel.createMessageCollector(
    msg => !msg.author.bot && msg.content.trim().toLowerCase() === word.toLowerCase(),
    { maxMatches: 1, time: 5 * 60 * 1000 }
  );

  wordsCollector.on('end', (answers, reason) => {
    if (reason === 'time') {
      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          title: 'Jumbled Word',
          description: `The game was ended as no one was able to answer within the given 5 minutes.\nThe correct answer was ${word}.`
        }
      }).then(() => {
        question.delete().catch(() => {});
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (reason === 'matchesLimit') {
      let answer = answers.first();

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Jumbled Word',
          description: `Congratulations ${answer.author}! You solved the jumbled word.\nThe correct answer was ${word}.`
        }
      }).then(() => {
        question.delete().catch(() => {});
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);
  });
};

exports.config = {
  aliases: [ 'scramble' ],
  enabled: true
};

exports.help = {
  name: 'jumbledWord',
  description: 'Unscramble the given jumbled word and increase your vocabulary skills while having fun with your friends.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'jumbledWord',
  example: []
};
