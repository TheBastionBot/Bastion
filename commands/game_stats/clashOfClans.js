/**
 * @file coc command
 * @author Niko Salonen
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

const statStrings =  {
  'clan': {
    'tag': 'Tag',
    'name': 'Name',
    'type': 'Type',
    'description': 'Description',
    'clanLevel': 'Clan level',
    'clanPoints': 'Clan points',
    'clanVersusPoints': 'Clan versus points',
    'requiredTrophies': 'Required Trophies',
    'warFrequency': 'War Frequency',
    'warWinStreak': 'War win streak',
    'warWins': 'War wins',
    'warTies': 'War ties',
    'warLosses': 'War losses',
    'isWarLogPublic': 'Is war log public?',
    'members': 'Members'
  },
  'player': {

    'tag': 'Tag',
    'name': 'Name',
    'expLevel': 'Exp level',
    'league': 'League',
    'trophies': 'Trophies',
    'versusTrophies': 'Versus trophies',
    'attackWins': 'Attack wins',
    'defenseWins': 'Defense wins',
    'clan': 'Clan',
    'bestTrophies': 'Best trophies',
    'donations': 'Donations',
    'donationsReceived': 'Donations received',
    'warStars': 'War stars',
    'role': 'Role',
    'townHallLevel': 'Town hall level',
    'builderHallLevel': 'Builder hall level',
    'bestVersusTrophies': 'Best versus trophies',
    'versusBattleWins': 'Versus battle wins',
    'legendStatistics': 'Legend statistics',
    'achievements': 'Achievements',
    'troops': 'Troops',
    'heroes': 'Heroes',
    'spells': 'Spells'

  }
} ;

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.type && !args.needle ) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    // If user doesn't provide the platform, default to PC
    if (args.needle && args.needle.length <= 3) {

      // API requires search string to be longer than three characters
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'needleTooShort', '4'), message.channel);
    }

    let options = {
      uri: `https://api.clashofclans.com/v1/${args.type}s?name=${encodeURIComponent(args.needle)}&limit=1`,
      headers: {
        'Authorization': `Bearer ${Bastion.credentials.clashOfClansAPIKey}`,
        'User-Agent': `Bastion/${Bastion.package.version} (${Bastion.user.tag}; ${Bastion.user.id}) https://bastionbot.org`
      },
      json: true
    };

    let result = await request(options);
    if (result.error) {
      return Bastion.emit('error', 'Error', result.error, message.channel);
    }


    let searchResults = result.items.map(stat => {
      Object.keys(stat).map(row => {
        // Map only keys found in the statStrings variable
        if (statStrings[args.type][row] !== undefined) {
          return {
            name: statStrings[args.type][stat.key],
            value: stat.value,
            inline: true
          };
        }
      });
    });


    let footerText = args.type === 'clan' ? `Check more at [Clash of Stats](https://clashofstats.com/clans/${result.tag})` : `[Player info](https://clashofstats.com/players/${result.tag}) | [Clan info](https://clashofstats.com/clans/${result.clan.tag}) - (from Clash of Stats)`;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: result.epicUserHandle
        },
        title: `Clash of Clans Stats - ${result.name} ${result.description ? `- ${result.description}` : ''}`,
        fields: searchResults,
        thumbnail: {
          url: result.badgeUrls && result.badgeUrls.large
        },
        footer: {
          text: footerText
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      return Bastion.emit('error', e.statusCode, e.error.message, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'type', type: String, alias: 's' },
    { name: 'needle', type: String,  defaultOption: true }


  ]
};

exports.help = {
  name: 'coc',
  description: 'Clash of Clans integration functions.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'coc <SEARCH_STRING|TAG> -s <clan|player>',
  example: [ 'coc "My super good clan" -s clan', 'coc "#8JRQ2VUL3" -s  player' ]
};
