/**
 * @file poll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.pollMessage || !/^(.+( ?; ?.+[^;])+)$/i.test(args.pollMessage.join(' '))) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    let pollMessage = args.pollMessage.join(' ').split(';');
    args.time = Math.abs(args.time);
    args.time = args.time && args.time < 1440 ? args.time : 60;

    if (!message.channel.hasOwnProperty('poll')) {
      message.channel.poll = {};
      message.channel.poll.usersVoted = [];

      let answers = [];
      for (let i = 1; i < pollMessage.length; i++) {
        answers.push({
          name: `${i}.`,
          value: `${pollMessage[i]}`,
          inline: true
        });
      }

      let pollStatus = await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Poll started',
          description: `A poll has been started by ${message.author}.\n\n**${pollMessage[0]}**`,
          fields: answers,
          footer: {
            text: `Vote by sending the corresponding number of the option. • Poll ends in ${args.time} minutes.`
          }
        }
      });

      message.channel.poll.collector = message.channel.createMessageCollector(
        m => (!m.author.bot && parseInt(m.content) > 0 && parseInt(m.content) < pollMessage.length && !message.channel.poll.usersVoted.includes(m.author.id)),
        { time: args.time * 60 * 1000 }
      );

      message.channel.poll.collector.on('collect', (msg, votes) => {
        if (msg.deletable) {
          msg.delete().catch(e => {
            Bastion.log.error(e);
          });
        }
        msg.channel.send({
          embed: {
            description: `Thank you, ${msg.author}, for voting.`,
            footer: {
              text: `${votes.collected.size} votes in total.`
            }
          }
        }).then(m => {
          message.channel.poll.usersVoted.push(msg.author.id);
          m.delete(5000).catch(e => {
            Bastion.log.error(e);
          });
        });
      });

      message.channel.poll.collector.on('end', (pollRes) => {
        pollRes = pollRes.map(r => r.content);
        pollRes = pollRes.filter(res => parseInt(res) && parseInt(res) > 0 && parseInt(res) < pollMessage.length);
        if (pollRes.length === 0) {
          return message.channel.send({
            embed: {
              color: Bastion.colors.RED,
              title: 'Poll Ended',
              description: 'Unfortunately, no votes were given.'
            }
          }).then(() => {
            pollStatus.delete().catch(e => {
              Bastion.log.error(e);
            });
            delete message.channel.poll;
          }).catch(e => {
            Bastion.log.error(e);
          });
        }

        for (let i = pollMessage.length - 1; i > 0; i--) {
          pollRes.unshift(i);
        }
        let count = {};
        for (let i = 0; i < pollRes.length; i++) {
          count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]] + 1 : 1;
        }
        let result = [];
        let totalVotes = (pollRes.length - (pollMessage.length - 1));
        for (let i = 1; i < pollMessage.length; i++) {
          let numOfVotes = count[Object.keys(count)[i - 1]] - 1;
          result.push({
            name: pollMessage[i],
            value: `${(numOfVotes / totalVotes) * 100}% (${numOfVotes} of ${totalVotes})`,
            inline: true
          });
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: 'Poll Ended',
            description: `Poll results for **${pollMessage[0]}**`,
            fields: result
          }
        }).then(() => {
          pollStatus.delete().catch(e => {
            Bastion.log.error(e);
          });
          delete message.channel.poll;
        }).catch(e => {
          Bastion.log.error(e);
        });
      });
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isEventInUse', true, 'poll'), message.channel);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'pollMessage', type: String, multiple: true, defaultOption: true },
    { name: 'time', type: Number, alias: 't', defaultValue: 60 }
  ]
};

exports.help = {
  name: 'poll',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'poll <question>;<option1>[;<option2>[...]] [-t TIME_IN_MINUTES]',
  example: [ 'poll Which is the game of the week?;Call of Duty©: Infinity Warfare;Tom Clancy\'s Ghost Recon© Wildlands' ]
};
