/**
 * @file trivia command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');
let activeChannels = [];

exports.exec = async (Bastion, message, args) => {
  try {
    if (activeChannels.includes(message.channel.id))  {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isGameInUse', true, 'trivia'), message.channel);
    }

    let difficulties = [ 'easy', 'medium', 'hard' ];
    args.difficulty = difficulties.includes(args.difficulty.toLowerCase()) ? args.difficulty.toLowerCase() : 'easy';

    let options = {
      method: 'GET',
      url: `https://opentdb.com/api.php?amount=1&type=boolean&difficulty=${args.difficulty}&encode=url3986`,
      json: true
    };
    let response = await request(options);

    if (!response) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    response = response.results[0];

    let question = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Trivia - True/False',
        description: decodeURIComponent(response.question),
        fields: [
          {
            name: 'Category',
            value: decodeURIComponent(response.category),
            inline: true
          },
          {
            name: 'Difficulty',
            value: response.difficulty.toTitleCase(),
            inline: true
          }
        ],
        footer: {
          text: 'Reply with either True/False within 60 seconds.'
        }
      }
    });

    activeChannels.push(message.channel.id);

    let validAnswers = [
      'true',
      'false'
    ];

    const trivia = message.channel.createMessageCollector(
      msg => !msg.author.bot && validAnswers.includes(msg.content.toLowerCase()),
      { maxMatches: 1, time: 60 * 1000 }
    );

    trivia.on('collect', ans => {
      let color, description;
      if (ans.content.toLowerCase() === response.correct_answer.toLowerCase()) {
        color = Bastion.colors.BLUE;
        description = `${ans.author.tag} you're absolutely right.`;
      }
      else {
        color = Bastion.colors.RED;
        description = `Unfortunately, you're wrong ${ans.author.tag}`;
      }

      message.channel.send({
        embed: {
          color: color,
          description: description
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    });

    trivia.on('end', (answers, reason) => {
      activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);

      if (reason === 'time') {
        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Trivia Ended',
            description: 'Trivia was ended as no one was able to answer within 60 seconds.'
          }
        }).then(() => {
          question.delete().catch(e => {
            Bastion.log.error(e);
          });
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'difficulty', type: String, alias: 'd', defaultValue: 'easy', defaultOption: true }
  ]
};

exports.help = {
  name: 'trivia',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'trivia [ --difficulty easy|medium|hard ]',
  example: [ 'trivia', 'trivial --difficulty hard' ]
};
