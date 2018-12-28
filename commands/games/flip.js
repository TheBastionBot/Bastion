/**
 * @file flip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let outcomes = [
    'Heads',
    'Tails'
  ];
  let outcome = outcomes.getRandom();

  if (args.coins) {
    if (args.coins > 50) args.coins = 50;

    for (let i = 1; i < args.coins; i++) {
      outcome += `, ${outcomes.getRandom()}`;
    }
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Flipped',
      description: outcome
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'coins', type: Number, alias: 'c', defaultOption: true }
  ]
};

exports.help = {
  name: 'flip',
  description: 'Flips the specified amount of coins and shows you the outcomes.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'flip [NO_OF_COINS]',
  example: [ 'flip', 'flip 5' ]
};
