/**
 * @file russianRoulette command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */


exports.exec = async (Bastion, message, args) => {
  args = isNaN(args = parseInt(args[0])) ? 1 : args > 7 ? 7 : args;

  const outcomes = [
    '🔫 BANG! You are dead, buddy.',
    'You got lucky, my friend.'
  ];

  let outcome = '';
  for (let i = 0; i < args; i++) {
    outcome = `${message.author} ${outcomes.getRandom()}`;

    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `Round ${i + 1}`,
        description: outcome
      }
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
  description: 'Play the ultimate game of chance - Russian Roulette! Let\'s see if you live or die.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'russianRoulette [no_of_bullets]',
  example: [ 'russianRoulette', 'russianRoulette 7' ]
};
