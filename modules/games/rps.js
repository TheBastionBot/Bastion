/**
 * @file rps command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let outcomes = [
    'ROCK',
    'PAPER',
    'SCISSOR'
  ];
  let userOutcome = args.join(' ').toUpperCase();
  if (!outcomes.includes(userOutcome)) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let botOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  // let botOutcome = outcomes.random();
  let result = 'I win! :yum:';
  if (userOutcome === botOutcome) {
    result = 'Oh damn! It\'s a draw, dude. :confused:';
  }
  else if (userOutcome === 'ROCK') {
    if (botOutcome === 'SCISSOR') {
      result = 'You win. :clap:';
    }
  }
  else if (userOutcome === 'PAPER') {
    if (botOutcome === 'ROCK') {
      result = 'You win. :clap:';
    }
  }
  else if (userOutcome === 'SCISSOR') {
    if (botOutcome === 'PAPER') {
      result = 'You win. :clap:';
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      description: `You chose **${userOutcome}**, I chose **${botOutcome}**. *${result}*`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'rps',
  description: 'Play the classic *rock paper scissor* game with the bot.',
  botPermission: '',
  userPermission: '',
  usage: 'rps <rock|paper|scissor>',
  example: [ 'rps Rock' ]
};
