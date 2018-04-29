/**
 * @file jumbledWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let activeChannels = [];

exports.exec = async (Bastion, message) => {
  try {
    if (activeChannels.includes(message.channel.id))  {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isGameInUse', true, 'jumbled word'), message.channel);
    }

    let words = require('../../data/words.json');

    let word = words[Math.floor(Math.random() * words.length)];

    let jumbledWord = scramble(word);

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
            description: 'The game was ended as no one was able to answer within the given 5 minutes.'
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
            description: `Congratulations ${answer.author}! You solved the jumbled word.`
          }
        }).then(() => {
          question.delete().catch(() => {});
        }).catch(e => {
          Bastion.log.error(e);
        });
      }

      activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'scramble' ],
  enabled: true
};

exports.help = {
  name: 'jumbledWord',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'jumbledWord',
  example: []
};


/**
 * Scrambles an word
 * @function shuffle
 * @param {String} word The word to scramble
 * @returns {String} The scrambled word
 */
function scramble(word) {
  word = word.split('');

  let i = word.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = word[--i];
    word[i] = word[j];
    word[j] = t;
  }

  return word.join('');
}
