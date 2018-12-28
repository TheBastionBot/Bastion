/**
 * @file roll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let outcomes = [
    ':one:',
    ':two:',
    ':three:',
    ':four:',
    ':five:',
    ':six:'
  ];
  let outcome = args.faces === 6 ? outcomes.getRandom() : Number.random(1, args.faces);

  if (args.dice) {
    if (args.dice > 50) args.dice = 50;

    for (let i = 1; i < args.dice; i++) {
      outcome += `, ${args.faces === 6 ? outcomes.getRandom() : Number.random(1, args.faces)}`;
    }
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Rolled',
      description: outcome
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'dice', type: Number, alias: 'd', defaultOption: true },
    { name: 'faces', type: Number, alias: 'f', defaultValue: 6 }
  ]
};

exports.help = {
  name: 'roll',
  description: 'Rolls the specified amount of dice, with specified number of faces, and shows you the outcomes.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roll [NO_OF_DICE] [-f FACES]',
  example: [ 'roll', 'roll 5', 'roll 6 -f 8' ]
};
