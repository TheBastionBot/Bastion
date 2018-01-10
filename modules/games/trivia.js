/**
 * @file trivia command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');
let activeChannels = [];

exports.exec = (Bastion, message) => {
  if (activeChannels.includes(message.channel.id))  {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isGameInUse', true, 'trivia'), message.channel);
  }

  let options = {
    method: 'GET',
    url: 'https://opentdb.com/api.php?amount=1&type=boolean&encode=url3986'
  };

  request(options, async (error, response, body) => {
    try {
      if (error) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
      }

      if (response) {
        if (response.statusCode === 200) {
          body = JSON.parse(body);
          body = body.results[0];

          let question = await message.channel.send({
            embed: {
              color: Bastion.colors.BLUE,
              title: 'Trivia - True/False',
              description: decodeURIComponent(body.question),
              fields: [
                {
                  name: 'Category',
                  value: decodeURIComponent(body.category),
                  inline: true
                },
                {
                  name: 'Difficulty',
                  value: body.difficulty.toTitleCase(),
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
            if (ans.content.toLowerCase() === body.correct_answer.toLowerCase()) {
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
        else {
          /**
          * Error condition is encountered.
          * @fires error
          */
          return Bastion.emit('error', response.statusCode, response.statusMessage, message.channel);
        }
      }
    }
    catch (e) {
      Bastion.log.error(e);
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'trivia',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'trivia',
  example: []
};
