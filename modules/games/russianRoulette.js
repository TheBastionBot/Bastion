/**
 * @file russianRoulette command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const outcomes = [
  '🔫 BANG! You are dead, buddy.',
  'You got lucky, my friend.'
];

exports.run = (Bastion, message, args) => {
  args = isNaN(args = parseInt(args[0])) ? 1 : args > 7 ? 7 : args;
  let outcome = '';
  for (let i = 0; i < args; i++) {
    outcome = `${message.author} ${outcomes[Math.floor(Math.random() * outcomes.length)]}`;
    // outcome = `${message.author} ${outcomes.random()}`;
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: `Round ${i + 1}`,
        description: outcome
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
    if (outcome.includes('BANG')) return;
  }
};

exports.config = {
  aliases: [ 'rr' ],
  enabled: true
};

exports.help = {
  name: 'russianroulette',
  description: 'Play the ultimate game of chance - Russian Roulette! Let\'s see if you live or die.',
  botPermission: '',
  userPermission: '',
  usage: 'russianRoulette [no_of_bullets]',
  example: [ 'russianRoulette', 'russianRoulette 7' ]
};
