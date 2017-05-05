/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

let activeChannels = {};

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^(.+( ?; ?.+[^;])+)$/i.test(args.join(' '))) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
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

    message.channel.send({embed: {
      color: Bastion.colors.green,
      title: 'Poll started',
      description: `A poll has been started by ${message.author}.\n\n**${args[0]}**`,
      fields: answers,
      footer: {
        text: 'Vote by typing the corresponding number of the option.'
      }
    }}).then(msg => {
      const votes = message.channel.createMessageCollector(
        m => (!m.author.bot && parseInt(m.content) > 0 && parseInt(m.content) < args.length && !activeChannels[message.channel.id].usersVoted.includes(m.author.id)) || ((m.author == message.author || m.author.id == message.guild.ownerID) && m.content == `${Bastion.config.prefix}endpoll`),
        { time: 60 * 60 * 1000 }
      );
      votes.on('collect', (msg, votes) => {
        if (msg.content == `${Bastion.config.prefix}endpoll`) {
          return votes.stop();
        }
        else {
          msg.delete().catch(e => {
            Bastion.log.error(e.stack);
          });
          msg.channel.send({embed: {
            color: Bastion.colors.dark_grey,
            description: `Thank you, ${msg.author}, for voting.`,
            footer: {
              text: `${votes.collected.size} votes in total.`
            }
          }}).then(m => {
            activeChannels[message.channel.id].usersVoted.push(msg.author.id);
            m.delete(5000);
          });
        }
      });
      votes.on('end', (pollRes, reason) => {
        total = pollRes.size;
        pollRes = pollRes.map(r => r.content);
        if (reason == 'user') {
          pollRes.splice(pollRes.indexOf(`${Bastion.config.prefix}endpoll`), 1);
        }
        if (pollRes.length == 0) {
          return message.channel.send({embed: {
            color: Bastion.colors.red,
            title: 'Poll Ended',
            description: 'Unfortunately, no votes were given.'
          }}).then(() => {
            msg.delete();
            delete activeChannels[message.channel.id];
          }).catch(e => {
            Bastion.log.error(e.stack);
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

        message.channel.send({embed: {
          color: Bastion.colors.blue,
          title: 'Poll Ended',
          description: `Poll results for **${args[0]}**`,
          fields: result
        }}).then(() => {
          msg.delete();
          delete activeChannels[message.channel.id];
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `Can\'t start a poll now. A poll is already running in this channel.\nWait for it to end or if you had started that previous poll or are the owner of this server, you can end that by typing \`${Bastion.config.prefix}endpoll\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'poll',
  description: 'Starts a poll in the current channel asking users to vote. Separate question & each answers with `;`',
  botPermission: '',
  userPermission: '',
  usage: 'poll <question>;option1>;option2[;<option3>[...]]',
  example: ['poll Which is the game of the week?;Call of Duty©: Infinity Warfare;Tom Clancy\'s Ghost Recon© Wildlands;Watch Dogs 2']
};
