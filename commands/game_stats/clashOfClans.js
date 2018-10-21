/**
 * @file coc command
 * @author Niko Salonen
 * @license GPL-3.0
 */
const request = xrequire('request-promise-native');
const Discord = require('discord.js');
const COC_API = 'https://api.clashofclans.com/v1/';
const statStrings = {
  clan: {
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
  clanByName: {
    clanLevel: 'Clan level',
    members: 'Members',
    clanPoints: 'Clan points',
    requiredTrophies: 'Required Trophies',
    type: 'Type',
    cos: 'Clash of Stats'
  },
  player: {
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
  },
  playerTag: {
    townHallLevel: 'Town hall level',
    expLevel: 'Exp',
    trophies: 'Trophies',
    clan: 'Clan',
    role: 'Role in clan'
  },
  type: {
    inviteOnly: 'Invite only',
    open: 'Open',
    closed:'Closed'
  },
  role: {
    admin: 'Admin',
    leader: 'Leader',
    coLeader: 'Co-leader',
    elder: 'Elder',
    member: 'Member'
  },
  upgrades: [ 'troops', 'spells', 'heroes' ]
};

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.needle) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }
    // #VJUL28PP
    if (
      args.needle &&
      (args.needle.charAt(0) !== '#' && args.needle.length <= 3)
    ) {
      // API requires search string to be longer than three characters
      return Bastion.emit(
        'error',
        '',
        Bastion.i18n.error(message.guild.language, 'needleTooShort', '4'),
        message.channel
      );
    }


    let tagSearch = args.needle.charAt(0) === '#';
    let player = typeof args.searchplayer !== 'undefined';
    let clanMembers = typeof args.clanMembers !== 'undefined';
    let upgrades = typeof args.upgrades !== 'undefined';
    let searchUri = tagSearch
      ? `clans/${encodeURIComponent(args.needle)}`
      : `clans?name=${encodeURIComponent(args.needle)}&limit=6`;

    if (player || upgrades) {
      searchUri = searchUri.replace(/clans\//gi, 'players/');
    }
    else if (clanMembers) {
      searchUri = `${searchUri}/members`;
    }

    let options = {
      uri: COC_API + searchUri,
      headers: {
        Authorization: `Bearer ${Bastion.credentials.clashOfClansAPIKey}`,
        'User-Agent': `Bastion/${Bastion.package.version} (${
          Bastion.user.tag
        }; ${Bastion.user.id}) https://bastionbot.org`
      },
      json: true
    };

    let result = await request(options);
    if (result.error) {
      return Bastion.emit('error', 'Error', result.error, message.channel);
    }

    // Create embed
    let embed = new Discord.RichEmbed().
      setColor(Bastion.colors.BLUE).
      setTimestamp();

    if (!tagSearch) {
      embed.setDescription(`Showing ${result.items.length} results for '${args.needle}'`);
      // Seach by string so several results maybe
      result.items.map((searchResult, i) => {
        if (i !== 0 && i % 2 === 0){
          embed.addBlankField(true);
        }
        let keys = Object.keys(statStrings['clanByName']);

        let cosLink =
       `https://clashofstats.com/clans/${searchResult.tag.replace(
         '#',
         ''
       )}/members`;


        embed.addField(
          `${searchResult.name} ${searchResult.tag}`,
          keys.map(key => {
            let value = searchResult[key];
            if (key === 'members') {
              value = `${value}/50`;
            }
            else if (key === 'type') {
              value = statStrings['type'][value];
            }
            else if (key === 'cos') {
              value = `[Here](${cosLink})`;
            }
            return `**${statStrings['clanByName'][key]}:** \t${value}`;
          }),
          true
        );

      });
      if (result.items.length % 3 === 0) {
        embed.addBlankField(true);
      }
    }
    else {

      if (clanMembers) {
        // result.items.map((member) => {
        embed.setDescription(`Clan ${args.needle} has ${result.items.length} members:`);

        let keys = Object.keys(statStrings['role']);
        keys.map(role => {
          if (result.items.some(member => member.role === role)) {

            let memberList = result.items.
              filter(member => member.role === role).
              map(member =>  `** ${member.name} ** ${member.tag}`);

            embed.addField(
              statStrings['role'][role],
              memberList,
              false
            );
          }
        });

      }
      else {
        if (upgrades) {

          embed.setTitle(`${result.name} Upgrades`).
            setDescription(
              `:mag: ${result.name} ${result.tag} upgrades:\r\n`
            );

          statStrings.upgrades.map(upgrade => {
            embed.addField(upgrade, result[upgrade].map(row => {
              return `**${row.name}** lvl ${row.level}/${row.maxLevel}`;
            }));
          });
        }
        else {


          let cosLink = !player
            ? `https://clashofstats.com/clans/${result.tag.replace(
              '#',
              ''
            )}/members`
            : `https://clashofstats.com/players/${result.tag.replace('#', '')}`;

          let cocLink = !player
            ? `https://link.clashofclans.com/?action=OpenClanProfile&tag=${encodeURIComponent(
              args.needle
            )}`
            : `https://link.clashofclans.com/?action=OpenPlayerProfile&tag=${encodeURIComponent(
              args.needle
            )}`;

          embed.setTitle(`${result.name} ${result.tag}`).setDescription(
            `:mag: View all on Clash of Stats ${cosLink}\r\n\r\nOpen in Clash of Clans ${cocLink}\r\n
          `
          );

          Object.keys(result).map(row => {
            // clan or player?
            const cp = player ? 'player' : 'clan';
            // Map only keys found in the statStrings variable
            if (statStrings[`${player ? 'player' : 'clan'}`][row] !== undefined) {
              if (row === 'clan') {
                embed.addField(
                  statStrings[cp][row],
                  `${result[row].name} ${result[row].name}`,
                  true
                );
              }
              else if (row === 'league') {
                embed.addField(statStrings[cp][row], result[row].name, true);
              }
              else if (Array.isArray(result[row])) {
                embed.addField(
                  statStrings[cp][row],
                  result[row].length ? result[row].length : 0,
                  true
                );
              }
              else {
                embed.addField(
                  statStrings[cp][row],
                  result[row] ? result[row] : 0,
                  true
                );
              }
            }
          });
        }
      }
    }
    message.channel.send({ embed }).catch(e => {
      Bastion.log.error(e);
    });
    /*
    if (args.type === 'clan') {

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
    */
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      if (e.error.code === 404) {
        return Bastion.emit('error', 'No search results', '', message.channel);
      }
      else if (e.error.code === 400) {
        return Bastion.emit(
          'error',
          'Incorrect parameters',
          '',
          message.channel
        );
      }
      else if (e.error.code === 429) {
        return Bastion.emit(
          'error',
          'Request was throttled',
          '',
          message.channel
        );
      }
      else if (e.error.code === 500) {
        return Bastion.emit('error', 'Unknown error', '', message.channel);
      }
      else if (e.error.code === 503) {
        return Bastion.emit(
          'error',
          'Server temporary unavailable',
          '',
          message.channel
        );
      }
      else if (e.error.reason === 'invalidIp') {
        return Bastion.emit(
          'error', 'Your IP address is not allowed to use the API key',
          '',
          message.channel
        );
      }
      return Bastion.emit(
        'error',
        e.statusCode,
        e.error.reason,
        message.channel
      );
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'needle', type: String, defaultOption: true },
    { name: 'searchplayer', type: String, alias: 'p' },
    { name: 'clanMembers', type: String, alias: 'm' },
    { name: 'upgrades', type: String, alias: 'u' }
  ]
};

exports.help = {
  name: 'coc',
  description: 'Clash of Clans integration functions.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'coc <SEARCH_STRING|TAG> -s <clan|player> -l <max results>',
  example: [
    'coc "My super good clan" -s -t clan -l 3',
    'coc #8JRQ2VUL3 -t player'
  ]
};
// coc <haku>
