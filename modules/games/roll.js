/**
 * @file roll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  let outcomes = [
    ':one:',
    ':two:',
    ':three:',
    ':four:',
    ':five:',
    ':six:'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  if (args[0] && parseInt(args[0])) {
    args[0] = parseInt(args[0]);
    if (args[0] > 10) {
      args[0] = 50;
    }
    for (let i = 1; i < args[0]; i++) {
      outcome += outcomes[Math.floor(Math.random() * outcomes.length)];
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roll [no_of_dice]',
  example: [ 'roll', 'roll 5' ]
};
