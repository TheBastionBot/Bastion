/**
 * @file rainbow6 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (args.length < 2) {
    return Bastion.emit('commandUsage', message, this.help);
  }
  if (!/^(uplay|ps4|xone)$/.test(args.platform = args.platform.toLowerCase())) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidPlatform', '`Uplay`, `PS4` and `XOne`'), message.channel);
  }
  if (!/^[a-zA-Z][\w-. ]{2,14}$/.test(args.username = args.username.join(' '))) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'username'), message.channel);
  }

  let data = await Bastion.methods.makeBWAPIRequest(`/gamestats/r6/${args.platform}/${args.username}`);

  let stats = [
    {
      name: 'Player Name',
      value: args.username
    },
    {
      name: 'Level',
      value: `${data.info.level}`,
      inline: true
    },
    {
      name: 'XP',
      value: `${data.info.xp}`,
      inline: true
    }
  ];

  if (data.rank && data.rank.seasons) {
    let seasons = Object.keys(data.rank.seasons);
    if (seasons.length) {
      let rank = data.rank.seasons[seasons[0]];
      rank.regions = Object.values(rank.regions);

      stats.push({
        name: rank.name,
        value: `Season ${rank.id}`
      });

      rank.regions.forEach(r => stats.push({
        name: getRegionName(r.region),
        value: `**RANK** ${r.current.name}\n**SKILL** ${r.skillMean} ± ${r.skillStdev}\n**WINS** ${r.wins}\n**LOSSES** ${r.losses}`,
        inline: true
      }));
    }
  }

  if (data.pvp) {
    stats.push(
      {
        name: 'PvP',
        value: `${args.username} has played PvP matches for **${(data.pvp.playtime / 60 / 60).toFixed(2)}** hours.`
      },
      {
        name: 'Wins',
        value: `${data.pvp.wins}`,
        inline: true
      },
      {
        name: 'Losses',
        value: `${data.pvp.losses}`,
        inline: true
      },
      {
        name: 'Kills',
        value: `${data.pvp.kills}`,
        inline: true
      },
      {
        name: 'Deaths',
        value: `${data.pvp.deaths}`,
        inline: true
      },
      {
        name: 'Matches',
        value: `${data.pvp.matches}`,
        inline: true
      },
      {
        name: 'Assists',
        value: `${data.pvp.assists}`,
        inline: true
      },
      {
        name: 'Win/Lose Ratio',
        value: `${(data.pvp.wins / data.pvp.losses).toFixed(2)}`,
        inline: true
      },
      {
        name: 'Kill/Death Ratio',
        value: `${(data.pvp.kills / data.pvp.deaths).toFixed(2)}`,
        inline: true
      }
    );
  }
  else {
    stats.push(
      {
        name: 'PVP',
        value: `${args.username} has not played any PvP matches.`
      }
    );
  }
  if (data.pve) {
    stats.push(
      {
        name: 'PvE',
        value: `${args.username} has played PvE matches for **${(data.pve.playtime / 60 / 60).toFixed(2)}** hours.`
      },
      {
        name: 'Wins',
        value: `${data.pve.wins}`,
        inline: true
      },
      {
        name: 'Losses',
        value: `${data.pve.losses}`,
        inline: true
      },
      {
        name: 'Kills',
        value: `${data.pve.kills}`,
        inline: true
      },
      {
        name: 'Deaths',
        value: `${data.pve.deaths}`,
        inline: true
      },
      {
        name: 'Matches',
        value: `${data.pve.matches}`,
        inline: true
      },
      {
        name: 'Assists',
        value: `${data.pve.assists}`,
        inline: true
      },
      {
        name: 'Win/Lose Ratio',
        value: `${(data.pve.wins / data.pve.losses).toFixed(2)}`,
        inline: true
      },
      {
        name: 'Kill/Death Ratio',
        value: `${(data.pve.kills / data.pve.deaths).toFixed(2)}`,
        inline: true
      }
    );
  }
  else {
    stats.push(
      {
        name: 'PvE',
        value: `${args.username} has not played any PvE matches.`
      }
    );
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Rainbow 6',
      url: `https://r6stats.com/stats/${args.platform}/${encodeURIComponent(args.username)}`,
      fields: stats,
      thumbnail: {
        url: 'https://vignette1.wikia.nocookie.net/rainbowsix/images/0/06/Rainbow_(Clear_Background)_logo.png'
      }
    }
  });
};

exports.config = {
  aliases: [ 'r6' ],
  enabled: true,
  argsDefinitions: [
    { name: 'username', type: String, multiple: true, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'uplay' }
  ]
};

exports.help = {
  name: 'rainbow6',
  description: 'Get stats of any Rainbow Six player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rainbow6 <username> [--platform uplay|ps4|xone]',
  example: [ 'rainbow6 SaffronPants --platform xone', 'rainbow6 k3rn31p4nic' ]
};

/**
 * Returns the region name of the specified region code.
 * @param {string} region The region code of the ranked stats
 * @returns {string} The region name
 */
const getRegionName = region => {
  region = region.toLowerCase();
  switch (region) {
    case 'emea':
      return 'Europe';
    case 'ncsa':
      return 'America';
    case 'apac':
      return 'Asia';
    default:
      return region;
  }
};
