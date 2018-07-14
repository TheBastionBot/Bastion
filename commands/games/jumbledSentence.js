/**
 * @file jumbledSentence command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let activeChannels = [];

exports.exec = async (Bastion, message) => {
  try {
    if (activeChannels.includes(message.channel.id))  {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'isGameInUse', 'jumbled sentence'), message.channel);
    }

    let quotes = xrequire('./assets/quotes.json');

    let quote = quotes[Bastion.methods.getRandomInt(1, Object.keys(quotes).length)];

    let jumbledSentence = scramble(quote.quote);

    let question = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: `Here's your jumbled sentence:\n**${jumbledSentence}**\nFirst person to unscramble it within 5 minutes wins the game.`
      }
    });

    activeChannels.push(message.channel.id);

    const wordsCollector = message.channel.createMessageCollector(
      msg => !msg.author.bot && msg.content.trim().toLowerCase() === quote.quote.toLowerCase(),
      { maxMatches: 1, time: 5 * 60 * 1000 }
    );

    wordsCollector.on('end', (answers, reason) => {
      if (reason === 'time') {
        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Jumbled Sentence',
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
            title: 'Jumbled Sentence',
            description: `Congratulations ${answer.author}! You solved the jumbled sentence.`
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
  aliases: [ 'scrambleSentence' ],
  enabled: true
};

exports.help = {
  name: 'jumbledSentence',
  description: 'Unscramble the given jumbled sentence and increase your sentence building skills while having fun with your friends.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'jumbledSentence',
  example: []
};


/**
 * Scrambles an sentence
 * @function scramble
 * @param {String} sentence The sentence to scramble
 * @returns {String} The scrambled sentence
 */
function scramble(sentence) {
  sentence = sentence.split(' ');

  let i = sentence.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = sentence[--i];
    sentence[i] = sentence[j];
    sentence[j] = t;
  }

  return sentence.join(' ');
}
