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
    let pokemon;
    if (args.name) {
      pokemon = await pokedex.getPokemonByName(encodeURIComponent(args.name.join(' ')));
    }
    else if (args.number) {
      pokemon = await pokedex.getPokemonByNumber(args.number);
    }
    else {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    pokemon = pokemon[0];

    let fields = [
      {
        name: 'Number',
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
        value: pokemon.types.join('\n'),
        inline: true
      },
      {
        name: 'Abilities',
        value: `Normal: ${pokemon.abilities.normal.join(', ') || '-'}\nHidden: ${pokemon.abilities.hidden.join(', ') || '-'}`,
        inline: true
      },
      {
        name: 'Egg Groups',
        value: pokemon.eggGroups.join('\n'),
        inline: true
      },
      {
        name: 'Gender Ratio',
        value: pokemon.gender.length ? `${pokemon.gender[0]}:${pokemon.gender[1]}` : 'Genderless',
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
      },
      {
        name: 'Description',
        value: pokemon.description
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
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'number', type: Number, alias: 'n' }
  ]
};

exports.help = {
  name: 'pokemon',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pokemon < POKEMON NAME | -n POKEDEX_NUMBER >',
  example: [ 'pokemon Pikachu', 'pokemon -n 658' ]
};
