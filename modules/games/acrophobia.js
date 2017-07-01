/**
 * @file acrophobia command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
let activeChannels = {};

exports.run = (Bastion, message) => {
  if (!activeChannels.hasOwnProperty(message.channel.id)) {
    activeChannels[message.channel.id] = {};
    activeChannels[message.channel.id].usersSubmitted = [];
    activeChannels[message.channel.id].usersVoted = [];

    let charPool = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    let acroLen = Bastion.functions.getRandomInt(2, 5);
    let acronym = [];
    for (let i = 0; i < acroLen; i++) {
      acronym.push(charPool[Math.floor(Math.random() * charPool.length)]);
      // acronym.push(charPool.random());
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: 'Acrophobia',
        description: `Game started by ${message.author}. Create a sentence with this acronym: **${acronym.join('. ')}.**`,
        footer: {
          text: `You have ${2} minutes to make your submission.`
        }
      }
    }).then(msg => {
      const collector = msg.channel.createMessageCollector(
        m => !m.author.bot && m.content.split(' ').length === acroLen && matchAcronym(acronym, m.content.split(' ')) && !activeChannels[message.channel.id].usersSubmitted.includes(m.author.id),
        { time: 2 * 60 * 1000 }
      );
      collector.on('collect', (msg, sentences) => {
        if (msg.deletable) {
          msg.delete().catch(e => {
            Bastion.log.error(e);
          });
        }
        msg.channel.send({
          embed: {
            color: Bastion.colors.dark_grey,
            description: `${msg.author} made their submission.`,
            footer: {
              text: `${sentences.collected.size} submissions in total.`
            }
          }
        }).then(m => {
          activeChannels[message.channel.id].usersSubmitted.push(msg.author.id);
          m.delete(5000).catch(e => {
            Bastion.log.error(e);
          });
        }).catch(e => {
          Bastion.log.error(e);
        });
      });
      collector.on('end', (collection) => {
        if (collection.size === 0) {
          message.channel.send({
            embed: {
              color: Bastion.colors.red,
              title: 'Acrophobia',
              description: 'Game ended. Unfortunately, no submissions were made for this acronym.'
            }
          }).then(() => {
            delete activeChannels[message.channel.id];
            msg.delete().catch(e => {
              Bastion.log.error(e);
            });
          }).catch(e => {
            Bastion.log.error(e);
          });
        }
        else {
          let submissions = [];
          for (let i = 0; i < collection.size; i++) {
            submissions.push(`**${i + 1}.** ${collection.map(a => a.content)[i]}`);
          }
          msg.channel.send({
            embed: {
              color: Bastion.colors.green,
              title: 'Acrophobia',
              description: 'Submissions closed',
              fields: [
                {
                  name: `Submitted sentences for ${acronym.join('. ')}.:`,
                  value: submissions.join('\n')
                }
              ],
              footer: {
                text: 'Vote by typing the corresponding number of a sentence. You have 60 seconds to vote.'
              }
            }
          }).then(subMsg => {
            msg.delete().catch(e => {
              Bastion.log.error(e);
            });
            const votesCollector = msg.channel.createMessageCollector(
              m => !m.author.bot && parseInt(m.content) > 0 && parseInt(m.content) <= collection.size && !activeChannels[message.channel.id].usersVoted.includes(m.author.id),
              { time: 60 * 1000 }
            );
            votesCollector.on('collect', (msg, votes) => {
              if (msg.deletable) {
                msg.delete().catch(e => {
                  Bastion.log.error(e);
                });
              }
              msg.channel.send({
                embed: {
                  color: Bastion.colors.dark_grey,
                  description: `Thank you, ${msg.author}, for voting.`,
                  footer: {
                    text: `${votes.collected.size} votes in total.`
                  }
                }
              }).then(m => {
                activeChannels[message.channel.id].usersVoted.push(msg.author.id);
                m.delete(5000).catch(e => {
                  Bastion.log.error(e);
                });
              });
            });
            votesCollector.on('end', votes => {
              if (votes.size === 0) {
                msg.channel.send({
                  embed: {
                    color: Bastion.colors.red,
                    title: 'Acrophobia',
                    description: 'Game ended. Unfortunately, no votes were given for any submissions.'
                  }
                }).then(() => {
                  delete activeChannels[message.channel.id].usersSubmitted;
                  delete activeChannels[message.channel.id];
                  subMsg.delete().catch(e => {
                    Bastion.log.error(e);
                  });
                }).catch(e => {
                  Bastion.log.error(e);
                });
              }
              else {
                votes = votes.map(v => v.content);
                for (let i = collection.size; i > 0; i--) {
                  votes.unshift(`${i}`);
                }
                let count = {};
                for (let i = 0; i < votes.length; i++) {
                  count[votes[i]] = count[votes[i]] ? count[votes[i]] + 1 : 1;
                }
                let winningVoteIndex = Object.keys(count).reduce(function(a, b) {
                  return count[a] > count[b] ? a : b;
                });
                msg.channel.send({
                  embed: {
                    color: Bastion.colors.blue,
                    title: 'Acrophobia',
                    description: `Game Ended. ${collection.map(s => s.author)[winningVoteIndex - 1]} won by ${count[winningVoteIndex] - 1} of ${votes.length - collection.size} votes`,
                    fields: [
                      {
                        name: 'Winning submission',
                        value: collection.map(s => s.content)[winningVoteIndex - 1]
                      }
                    ]
                  }
                }).then(() => {
                  delete activeChannels[message.channel.id].usersVoted;
                  delete activeChannels[message.channel.id].usersSubmitted;
                  delete activeChannels[message.channel.id];
                  subMsg.delete().catch(e => {
                    Bastion.log.error(e);
                  });
                }).catch(e => {
                  Bastion.log.error(e);
                });
              }
            });
          }).catch(e => {
            Bastion.log.error(e);
          });
        }
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    Bastion.emit('error', string('busy', 'errors'), string('isGameInUse', 'errorMessage', 'acrophobia'), message.channel);
  }
};

exports.config = {
  aliases: [ 'acro' ],
  enabled: true
};

exports.help = {
  name: 'acrophobia',
  description: string('acrophobia', 'commandDescription'),
  userPermission: '',
  usage: 'acrophobia',
  example: []
};

/**
 * Matches the first character of each element of a array of string to a character pool.
 * @function matchAcronym
 * @param {array} charPool The array that contains the character pool.
 * @param {array} strArr The array of the string to match with the character pool.
 * @returns {boolean} If the first character of each element of the array of string matches the character pool.
*/
function matchAcronym(charPool, strArr) {
  for (let i = 0; i < charPool.length; i++) {
    if (charPool[i] !== strArr[i].charAt(0).toUpperCase()) {
      return false;
    }
  }
  return true;
}
