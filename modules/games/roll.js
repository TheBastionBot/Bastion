/**
 * @file roll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

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
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'roll',
  description: string('roll', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'roll [no_of_dice]',
  example: [ 'roll', 'roll 5' ]
};
