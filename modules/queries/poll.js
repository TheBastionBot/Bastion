/**
 * @file poll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let activeChannels = {};

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1 || !/^(.+( ?; ?.+[^;])+)$/i.test(args.join(' '))) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    args = args.join(' ').split(';');

    if (!activeChannels.hasOwnProperty(message.channel.id)) {
      activeChannels[message.channel.id] = {};
      activeChannels[message.channel.id].usersVoted = [];

      let answers = [];
      for (let i = 1; i < args.length; i++) {
        answers.push({
          name: `${i}.`,
          value: `${args[i]}`,
          inline: true
        });
      }

      let pollStatus = await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Poll started',
          description: `A poll has been started by ${message.author}.\n\n**${args[0]}**`,
          fields: answers,
          footer: {
            text: 'Vote by typing the corresponding number of the option.'
          }
        }
      });

      const votes = message.channel.createMessageCollector(
        m => (!m.author.bot && parseInt(m.content) > 0 && parseInt(m.content) < args.length && !activeChannels[message.channel.id].usersVoted.includes(m.author.id)) || ((m.author === message.author || m.author.id === message.guild.ownerID) && m.content === `${message.guild.prefix[0]}endpoll`),
        { time: 6 * 60 * 60 * 1000 }
      );

      votes.on('collect', (msg, votes) => {
        if (msg.content === `${message.guild.prefix[0]}endpoll`) {
          return votes.stop();
        }
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
          activeChannels[message.channel.id].usersVoted.push(msg.author.id);
          m.delete(5000).catch(e => {
            Bastion.log.error(e);
          });
        });
      });

      votes.on('end', (pollRes, reason) => {
        pollRes = pollRes.map(r => r.content);
        if (reason === 'user') {
          pollRes.splice(pollRes.indexOf(`${message.guild.prefix[0]}endpoll`), 1);
        }
        pollRes = pollRes.filter(res => parseInt(res) && parseInt(res) > 0 && parseInt(res) < args.length);
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
            delete activeChannels[message.channel.id];
          }).catch(e => {
            Bastion.log.error(e);
          });
        }

        for (let i = args.length - 1; i > 0; i--) {
          pollRes.unshift(i);
        }
        let count = {};
        for (let i = 0; i < pollRes.length; i++) {
          count[pollRes[i]] = count[pollRes[i]] ? count[pollRes[i]] + 1 : 1;
        }
        let result = [];
        for (let i = 1; i < args.length; i++) {
          result.push({
            name: args[i],
            value: `${((count[Object.keys(count)[i - 1]] - 1) / (pollRes.length - (args.length - 1))) * 100}%`,
            inline: true
          });
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: 'Poll Ended',
            description: `Poll results for **${args[0]}**`,
            fields: result
          }
        }).then(() => {
          pollStatus.delete().catch(e => {
            Bastion.log.error(e);
          });
          delete activeChannels[message.channel.id];
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
  enabled: true
};

exports.help = {
  name: 'poll',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'poll <question>;<option1>;<option2>[;<option3>[...]]',
  example: [ 'poll Which is the game of the week?;Call of Duty©: Infinity Warfare;Tom Clancy\'s Ghost Recon© Wildlands;Watch Dogs 2' ]
};
