/**
 * @file rps command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  let outcomes = [
    'ROCK',
    'PAPER',
    'SCISSOR'
  ];
  let userOutcome = args.join(' ').toUpperCase();

  if (!outcomes.includes(userOutcome)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let botOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

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
      color: Bastion.colors.BLUE,
      description: `You chose **${userOutcome}**, I chose **${botOutcome}**. *${result}*`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'rps',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rps <rock|paper|scissor>',
  example: [ 'rps Rock' ]
};
