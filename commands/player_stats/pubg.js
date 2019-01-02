/**
 * @file pubg command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.player || !args.mode) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let gameModes = [
    'solo', 'duo', 'squad', 'solo-fpp', 'duo-fpp', 'squad-fpp'
  ];
  let modeRegExp = new RegExp(`^(${gameModes.join('|')})$`, 'i');
  if (!modeRegExp.test(args.mode)) {
    return Bastion.emit('error', '', `You have entered an invalid game mode. Valid game modes are: ${gameModes.join(', ').toUpperCase()}`, message.channel);
  }

  let stats = await Bastion.methods.makeBWAPIRequest(`/gamestats/pubg/steam/${args.player}/lifetime`);

  stats = stats.data.attributes.gameModeStats[args.mode.toLowerCase()];

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: args.player
      },
      title: 'Player Stats',
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
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, alias: 'p', defaultOption: true },
    { name: 'mode', type: String, alias: 'm' }
  ]
};

exports.help = {
  name: 'pubg',
  description: 'Get stats of any PlayerUnknown\'s Battlegrounds player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pubg <PLAYER_NAME> <-m MODE>',
  example: [ 'pubg VVipe -m Squad' ]
};
