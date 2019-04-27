/**
 * @file roll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (args.additiveModifier === undefined) args.additiveModifier = 0;
  if (args.multiplier === undefined) args.multiplier = 1;

  let outcomes = [
    1, 2, 3, 4, 5, 6
  ];
  let outcome = args.faces === 6 ? outcomes.getRandom() : Number.random(1, args.faces);

  if (Object.keys(args).indexOf('additiveModifier') < Object.keys(args).indexOf('multiplier')) {
    outcome += args.additiveModifier;
    outcome *= args.multiplier;
  }
  else {
    outcome *= args.multiplier;
    outcome += args.additiveModifier;
  }

  if (args.dice) {
    if (args.dice > 50) args.dice = 50;

    for (let i = 1; i < args.dice; i++) {
      let tempOutcome = args.faces === 6 ? outcomes.getRandom() : Number.random(1, args.faces);

      if (Object.keys(args).indexOf('additiveModifier') < Object.keys(args).indexOf('multiplier')) {
        tempOutcome += args.additiveModifier;
        tempOutcome *= args.multiplier;
      }
      else {
        tempOutcome *= args.multiplier;
        tempOutcome += args.additiveModifier;
      }

      outcome += `, ${tempOutcome}`;
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
    { name: 'faces', type: Number, alias: 'f', defaultValue: 6 },
    { name: 'additiveModifier', type: Number, alias: 'a' },
    { name: 'multiplier', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'roll',
  description: 'Rolls the specified amount of dice, with specified modifiers, and shows you the outcomes.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roll [NO_OF_DICE] [-f FACES] [-a ADDITIVE_MODIFIER] [-m MULTIPLIER]',
  example: [ 'roll', 'roll 5', 'roll 6 -f 8', 'roll 6 -f 8 -a 4 -m 3', 'roll 5 -m 3 -a 4' ]
};
