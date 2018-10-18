/**
 * @file wow command
 * @author James Naylor (a.k.a euronay)
 * @license GPL-3.0
 */

const request = require('request-promise-native');

const wowConstants = {
  faction: [
    'Alliance',
    'Horde'
  ],
  gender: [
    'None',
    'Male',
    'Female'
  ],
  race: [
    'None',
    'Human',
    'Orc',
    'Dwarf',
    'Night Elf',
    'Undead',
    'Tauren',
    'Gnome',
    'Troll',
    'Goblin',
    'Blood Elf',
    'Draenei',
    'Fel Orc',
    'Naga',
    'Broken',
    'Skeleton',
    'Vrykul',
    'Tuskarr',
    'Forest Troll',
    'Taunka',
    'Northrend Skeleton',
    'Ice Troll',
    'Worgen',
    'Gilnean',
    'Pandaren',
    'Pandaren',
    'Pandaren',
    'Nightborn',
    'Highmountain Tauren',
    'Void Elf',
    'Lightforged Draenei',
    'Zandalari Troll',
    'Kul Tiran',
    'Human',
    'Dark Iron Dwarf',
    'Vulpera',
    'Mag\'har Orc'
  ],
  class: [
    'None',
    'Warrior',
    'Paladin',
    'Hunter',
    'Rogue',
    'Priest',
    'Death Knight',
    'Shaman',
    'Mage',
    'Warlock',
    'Druid',
    'Demon Hunter'
  ]
};

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.character || !args.realm) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.region = args.region.toLowerCase();
    let locale = args.region === 'us' ? 'en-us' : 'en-gb';

    let options = {
      url: `https://${args.region}.api.battle.net/wow/character/${args.realm}/${args.character}`,
      qs: {
        fields: 'guild,items',
        locale: locale,
        apikey: Bastion.credentials.battleNetApiKey
      },
      json: true
    };

    let response = await request(options);

    let factionIcon = `https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-${response.faction === 0 ? 'alliance' : 'horde'}.png`;
    let avatar = `https://render-${args.region}.worldofwarcraft.com/character/${response.thumbnail}`;

    let stats = [
      {
        name: 'Character',
        value: `${response.level} - ${wowConstants.race[response.race]} - ${wowConstants.class[response.class]}`
      },
      {
        name: 'Achievement Points',
        value: response.achievementPoints,
        inline: true
      },
      {
        name: 'Item Level',
        value: response.items.averageItemLevel,
        inline: true
      }
    ];

    if (response.guild) {
      stats.push(
        {
          name: 'Guild',
          value: response.guild.name,
          inline: true
        }
      );
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: response.name,
          url: `https://worldofwarcraft.com/${locale}/character/${args.realm}/${args.character}`,
          icon_url: factionIcon
        },
        fields: stats,
        thumbnail: {
          url: avatar
        },
        footer: {
          text: 'Powered by Blizzard Battle.net'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      if (e.statusCode === 404) {
        return Bastion.emit('error', '', Bastion.strings.error(message.guild.language, 'notFound', true, 'player'), message.channel);
      }
      return Bastion.emit('error', e.statusCode, e.error.message, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'character', type: String, defaultOption: true },
    { name: 'realm', type: String, alias: 'r' },
    { name: 'region', type: String, defaultValue: 'us' }
  ]
};

exports.help = {
  name: 'wow',
  description: 'Get stats of any World of Warcraft character from the Armory.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wow <CHARACTER> <--realm REALM> [-region <REGION>]',
  example: [
    'wow Fallken --realm Burning-Blade --region EU'
  ]
};
