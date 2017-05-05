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

const outcomes = [
  '🔫 BANG! You are dead, buddy.',
  'You got lucky, my friend.'
];

exports.run = (Bastion, message, args) => {
  args = isNaN(args = parseInt(args[0])) ? 1 : args > 7 ? 7 : args;
  let outcome = '';
  for (let i = 0; i < args; i++) {
    outcome = `${message.author} ${outcomes.random()}`;
    message.channel.send({embed: {
      color: Bastion.colors.blue,
      title: `Round ${i + 1}`,
      description: outcome
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
    if (outcome.includes('BANG')) return;
  }
};

exports.config = {
  aliases: ['rr']
};

exports.help = {
  name: 'russianroulette',
  description: 'Play the ultimate game of chance - Russian Roulette! Let\'s see if you live or die.',
  botPermission: '',
  userPermission: '',
  usage: 'russianRoulette [no_of_bullets]',
  example: ['russianRoulette', 'russianRoulette 7']
};
