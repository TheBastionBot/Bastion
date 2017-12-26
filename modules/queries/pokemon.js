/**
 * @file pokemon command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Pokedex = require('pokedex-api');
const pokedex = new Pokedex({
  userAgent: 'Bastion: Discord Bot (https://bastionbot.org)',
  version: 'v1'
});

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.number) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let pokemon = await pokedex.getPokemonByNumber(args.number);
    pokemon = pokemon[0];

    let fields = [
      {
        name: 'Pokédex Number',
        value: pokemon.number,
        inline: true
      },
      {
        name: 'Species',
        value: pokemon.species,
        inline: true
      },
      {
        name: 'Types',
        value: pokemon.types.join(', '),
        inline: true
      },
      {
        name: 'Abilities',
        value: `Normal: ${pokemon.abilities.normal.join(', ') || '-'}\nHidden: ${pokemon.abilities.hidden.join(', ') || '-'}`,
        inline: true
      },
      {
        name: 'Egg Groups',
        value: pokemon.eggGroups.join(', '),
        inline: true
      },
      {
        name: 'Gender',
        value: pokemon.gender.length ? `Male: ${pokemon.gender[0]}%\nFemale: ${pokemon.gender[1]}%` : 'Genderless',
        inline: true
      },
      {
        name: 'Height',
        value: pokemon.height,
        inline: true
      },
      {
        name: 'Weight',
        value: pokemon.weight,
        inline: true
      },
      {
        name: 'Evolution Line',
        value: pokemon.family.evolutionLine.join(' -> ')
      }
    ];

    let note = '';
    if (pokemon.starter) {
      note = note.concat('Is a starter pokemon\n');
    }
    if (pokemon.legendary) {
      note = note.concat('Is a legendary pokemon\n');
    }
    if (pokemon.mythical) {
      note = note.concat('Is a mythical pokemon\n');
    }
    if (pokemon.ultraBeast) {
      note = note.concat('Is an ultra beast\n');
    }
    if (pokemon.mega) {
      note = note.concat('Can mega evolve\n');
    }

    fields.push({
      name: 'Notes',
      value: note.length ? note : '-'
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: pokemon.name,
        description: `Discovered in generation ${pokemon.gen}`,
        fields: fields,
        thumbnail: {
          url: pokemon.sprite
        },
        footer: {
          icon_url: 'https://pokedevs.bastionbot.org/favicon.png',
          text: 'Powered by Pokedex API by PokéDevs'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.statusCode) {
      if (e.statusCode === 404) {
        return Bastion.emit('error', e.error.error, e.error.message.replace('You should head home: https://pokedevs.bastionbot.org', ''), message.channel);
      }
      else if (e.statusCode === 429) {
        return Bastion.emit('error', e.error.error, e.error.message, message.channel);
      }
      return Bastion.emit('error', e.statusCode, e.message, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'number', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'pokemon',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pokemon <POKEDEX_NUMBER>',
  example: [ 'pokemon 658' ]
};
