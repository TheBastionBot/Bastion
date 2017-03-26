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

exports.run = function(Bastion, message, args) {
  let outcomes = [
    'ROCK',
    'PAPER',
    'SCISSOR'
  ];
  let userOutcome = args.join(' ').toUpperCase();
  if (outcomes.indexOf(userOutcome) < 0) return;
  let botOutcome = outcomes[Math.floor(Math.random()*outcomes.length)];
  let result = 'I win! :yum:';
  if (userOutcome == botOutcome)
    result = 'Oh damn! It\'s a draw, dude. :confused:';
  else if (userOutcome == 'ROCK')
    if (botOutcome == 'SCISSOR')
      result = 'You win. :clap:';
  else if (userOutcome == 'PAPER')
    if (botOutcome == 'ROCK')
      result = 'You win. :clap:';
  else if (userOutcome == 'SCISSOR')
    if (botOutcome == 'PAPER')
      result = 'You win. :clap:';

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    description: `You chose **${userOutcome}**, I chose **${botOutcome}**. *${result}*`
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'rps',
  description: 'Play the classic *rock paper scissor* game with the bot.',
  permission: '',
  usage: 'rps <rock|paper|scissor>',
  example: ['rps Rock']
};
