/**
 * @file russianRoulette command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const outcomes = [
  '🔫 BANG! You are dead, buddy.',
  'You got lucky, my friend.'
];

exports.exec = (Bastion, message, args) => {
  args = isNaN(args = parseInt(args[0])) ? 1 : args > 7 ? 7 : args;
  let outcome = '';
  for (let i = 0; i < args; i++) {
    outcome = `${message.author} ${outcomes[Math.floor(Math.random() * outcomes.length)]}`;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `Round ${i + 1}`,
        description: outcome
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    if (outcome.includes('BANG')) return;
  }
};

exports.config = {
  aliases: [ 'rr' ],
  enabled: true
};

exports.help = {
  name: 'russianRoulette',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'russianRoulette [no_of_bullets]',
  example: [ 'russianRoulette', 'russianRoulette 7' ]
};
