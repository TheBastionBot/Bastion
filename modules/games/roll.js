/**
 * @file roll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  let outcomes = [
    ':one:',
    ':two:',
    ':three:',
    ':four:',
    ':five:',
    ':six:'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  // let outcome = outcomes.random();
  if (args[0] && parseInt(args[0])) {
    for (let i = 1; i < args[0]; i++) {
      outcome += outcomes[Math.floor(Math.random() * outcomes.length)];
      // outcome += outcomes.random();
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'You rolled:',
      description: outcome
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
  name: 'roll',
  description: 'Rolls a dice and gives you the the outcome. If a number is provided as an argument, it rolls that no. of dice.',
  botPermission: '',
  userPermission: '',
  usage: 'roll [no_of_dice]',
  example: [ 'roll', 'roll 5' ]
};
