/**
 * @file coc command
 * @author Niko Salonen
 * @license GPL-3.0
 */
const request = xrequire('request-promise-native');
const Discord = require('discord.js');
const statStrings = {
  clan: {
    tag: 'Tag',
    name: 'Name',
    type: 'Type',
    description: 'Description',
    clanLevel: 'Clan level',
    clanPoints: 'Clan points',
    clanVersusPoints: 'Clan versus points',
    requiredTrophies: 'Required Trophies',
    warFrequency: 'War Frequency',
    warWinStreak: 'War win streak',
    warWins: 'War wins',
    warTies: 'War ties',
    warLosses: 'War losses',
    isWarLogPublic: 'Is war log public?',
    members: 'Members'
  },
  player: {
    tag: 'Tag',
    name: 'Name',
    expLevel: 'Exp level',
    league: 'League',
    trophies: 'Trophies',
    versusTrophies: 'Versus trophies',
    attackWins: 'Attack wins',
    defenseWins: 'Defense wins',
    clan: 'Clan',
    bestTrophies: 'Best trophies',
    donations: 'Donations',
    donationsReceived: 'Donations received',
    warStars: 'War stars',
    role: 'Role',
    townHallLevel: 'Town hall level',
    builderHallLevel: 'Builder hall level',
    bestVersusTrophies: 'Best versus trophies',
    versusBattleWins: 'Versus battle wins',
    legendStatistics: 'Legend statistics',
    achievements: 'Achievements',
    troops: 'Troops',
    heroes: 'Heroes',
    spells: 'Spells'
  }
};

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.type && !args.needle) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    // If user doesn't provide the platform, default to PC
    if (args.needle && args.needle.length <= 3) {
      // API requires search string to be longer than three characters
      return Bastion.emit(
        'error',
        '',
        Bastion.i18n.error(message.guild.language, 'needleTooShort', '4'),
        message.channel
      );
    }

    let searchUri =
      args.type === 'clan'
        ? `https://api.clashofclans.com/v1/clans?name=${encodeURIComponent(args.needle)}&limit=${
          args.limit
        }`
        : `https://api.clashofclans.com/v1/players/${encodeURIComponent(args.needle)}`;

    let options = {
      uri: searchUri,
      headers: {
        Authorization: `Bearer ${Bastion.credentials.clashOfClansAPIKey}`,
        'User-Agent': `Bastion/${Bastion.package.version} (${Bastion.user.tag}; ${
          Bastion.user.id
        }) https://bastionbot.org`
      },
      json: true
    };
    let result = await request(options);
    if (result.error) {

      return Bastion.emit('error', 'Error', result.error, message.channel);
    }

    if (args.type === 'clan') {
      result.items.map(stat => {
        let cocLink =
          args.type === 'clan'
            ? `https://clashofstats.com/clans/${stat.tag.replace('#', '')}`
            : `https://clashofstats.com/players/${stat.tag.replace('#', '')}`;
        let linkString =
          args.type === 'clan'
            ? `Check more at [Clash of Stats](${cocLink})`
            : `[Player info](${cocLink}) | [Clan info](https://clashofstats.com/clans/${stat.clan.tag.replace(
              '#',
              ''
            )} - (from Clash of Stats)`;

        let embed = new Discord.RichEmbed().
          setTitle(`${args.type} search`).
          setDescription(
            `Here's ${result.items.length} search results for ${args.type} ${
              args.needle
            }. ${linkString}`
          ).
          setColor(Bastion.colors.BLUE).
          setAuthor(stat.name).
          setThumbnail(stat.badgeUrls.large).
          setTimestamp();
        Object.keys(stat).map(row => {
          // Map only keys found in the statStrings variable
          if (statStrings[args.type][row] !== undefined) {
            embed.addField(statStrings[args.type][row], stat[row], true);
          }
        });

        message.channel.send({ embed }).catch(e => {
          Bastion.log.error(e);
        });
      });
    }
    else {
      let cocLink = `https://clashofstats.com/players/${result.tag.replace('#', '')}`;
      let playerLink = `\n\r[Player info](${cocLink})`;
      let clanLink =
        result.clan !== undefined
          ? ` | [Clan info](https://clashofstats.com/clans/${result.clan.tag.replace('#', '')})`
          : '';
      let fromLink = ' - (from Clash of Stats)';
      let linkString = playerLink + clanLink + fromLink;

      let embed = new Discord.RichEmbed().
        setTitle('Player search').
        setDescription(`Here's search results for ${args.needle}.  ${linkString}`).
        setColor(Bastion.colors.BLUE).
        setAuthor(result.name).
        setThumbnail(
          result.league !== undefined
            ? result.league.iconUrls.large
            : result.clan !== undefined
              ? result.clan.badgeUrls.large
              : ''
        ).
        setTimestamp();
      Object.keys(result).map(row => {
        // Map only keys found in the statStrings variable
        if (statStrings[args.type][row] !== undefined) {
          embed.addField(statStrings['player'][row], result[row], true);
        }
      });

      message.channel.send({ embed }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      if (e.error.reason === 'notFound') {
        return Bastion.emit('error', 'No search results', '', message.channel);
      }
      return Bastion.emit('error', e.statusCode, e.error.reason, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'type', type: String, alias: 't', defaultValue: 'clan' },
    { name: 'needle', type: String, defaultOption: true },
    { name: 'limit', type: Number, alias: 'l', defaultValue: 3 },
    { name: 'search', type: Boolean, alias: 's' }
  ]
};

exports.help = {
  name: 'coc',
  description: 'Clash of Clans integration functions.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'coc <SEARCH_STRING|TAG> -s <clan|player> -l <max results>',
  example: [ 'coc "My super good clan" -s -t clan -l 3', 'coc #8JRQ2VUL3 -t player' ]
};
