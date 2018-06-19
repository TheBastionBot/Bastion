/**
 * @file pubg command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.player || !args.region || !args.mode || !args.season) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let validSeasons = [
      '2017-beta',
      '2017-pre1', '2017-pre2', '2017-pre3', '2017-pre4', '2017-pre5', '2017-pre6', '2017-pre7', '2017-pre8', '2017-pre9',
      '2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08', '2018-09', '2018-10', '2018-11', '2018-12'
    ];
    let seasonRegExp = new RegExp(`^(${validSeasons.join('|')})$`, 'i');
    if (!seasonRegExp.test(args.season)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), `You have entered an invalid season. Valid seasons are: ${validSeasons.join(', ').toUpperCase()}`, message.channel);
    }

    let availableRegions = [
      'krjp', 'jp', 'na', 'eu', 'oc', 'kakao', 'sea', 'sa', 'as'
    ];
    let regionRegExp = new RegExp(`^(${availableRegions.join('|')})$`, 'i');
    if (!regionRegExp.test(args.region)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidRegion', true, availableRegions.join(', ').toUpperCase()), message.channel);
    }

    let gameModes = [
      'solo', 'duo', 'squad', 'solo-fpp', 'duo-fpp', 'squad-fpp'
    ];
    let modeRegExp = new RegExp(`^(${gameModes.join('|')})$`, 'i');
    if (!modeRegExp.test(args.mode)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), `You have entered an invalid game mode. Valid game modes are: ${gameModes.join(', ').toUpperCase()}`, message.channel);
    }

    let options = {
      headers: {
        'Authorization': `Bearer ${Bastion.credentials.PUBGAPIKey}`
      },
      url: `https://api.playbattlegrounds.com/shards/pc-${args.region.toLowerCase()}/players`,
      qs: {
        'filter[playerNames]': args.player
      },
      json: true
    };
    let response = await request(options);

    if (response.data && response.data.length) {
      let playerID = response.data[0].id;

      options = {
        headers: {
          'Authorization': `Bearer ${Bastion.credentials.PUBGAPIKey}`
        },
        url: `https://api.playbattlegrounds.com/shards/pc-${args.region.toLowerCase()}/players/${playerID}/seasons/division.bro.official.${args.season.toLowerCase()}`,
        json: true
      };
      response = await request(options);

      let stats = response.data.attributes.gameModeStats[args.mode.toLowerCase()];

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          author: {
            name: args.player
          },
          title: `Player Stats: Season ${args.season.toUpperCase()}`,
          description: `Won **${stats.wins}** matches and lost **${stats.losses}** matches out of the **${stats.roundsPlayed}** matches played, in **${stats.days}** days, with **${(stats.winPoints + (stats.killPoints * 0.2)).toFixed(2)}** overall points.`,
          fields: [
            {
              name: 'Kills',
              value: `${stats.kills} ${stats.headshotKills ? `(${stats.headshotKills} headshots)` : ''}`,
              inline: true
            },
            {
              name: 'Assists',
              value: `${stats.assists}`,
              inline: true
            },
            {
              name: 'Win Points',
              value: `${stats.winPoints.toFixed(2)}`,
              inline: true
            },
            {
              name: 'Kill Points',
              value: `${stats.killPoints.toFixed(2)}`,
              inline: true
            },
            {
              name: 'Max. Kill Streaks',
              value: `${stats.maxKillStreaks}`,
              inline: true
            },
            {
              name: 'Most Kills / Round',
              value: `${stats.roundMostKills}`,
              inline: true
            },
            {
              name: 'Heals',
              value: `${stats.heals}`,
              inline: true
            },
            {
              name: 'Revives',
              value: `${stats.revives}`,
              inline: true
            },
            {
              name: 'Longest Kill',
              value: `${stats.longestKill.toFixed(2)}m`,
              inline: true
            },
            {
              name: 'Damage Dealt',
              value: `${stats.damageDealt.toFixed(2)}`,
              inline: true
            },
            {
              name: 'Time Survived',
              value: `${(stats.timeSurvived / 60).toFixed(2)} min (${(stats.longestTimeSurvived / 60).toFixed(2)} min longest) ${stats.suicides ? `(${stats.suicides} suicides)` : ''}`
            },
            {
              name: 'Distance Traveled',
              value: `${stats.rideDistance.toFixed(2)}m on vehicle & ${stats.walkDistance.toFixed(2)}m on foot`
            },
            {
              name: 'Weapons Acquired',
              value: `${stats.weaponsAcquired}`,
              inline: true
            },
            {
              name: 'Vehicles Destroyed',
              value: `${stats.vehicleDestroys}`,
              inline: true
            }
          ],
          thumbnail: {
            url: 'https://res.cloudinary.com/teepublic/image/private/s--DpQVVZhi--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1513709841/production/designs/2198091_1.jpg'
          },
          footer: {
            text: 'Powered by PlayerUnknown\'s Battlegrounds'
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (response.error) {
      Bastion.emit('error', 'PUBG API:', response.error, message.channel);
    }
    else {
      Bastion.log.error(response);
    }
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
    { name: 'player', type: String, alias: 'p', defaultOption: true },
    { name: 'region', type: String, alias: 'r' },
    { name: 'mode', type: String, alias: 'm' },
    { name: 'season', type: String, alias: 's', defaultValue: '2018-04' }
  ]
};

exports.help = {
  name: 'pubg',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pubg <player_name> <-r region> <-m mode> <-s season>',
  example: [ 'pubg VVipe -r EU -m squad -s 2018-04' ]
};
