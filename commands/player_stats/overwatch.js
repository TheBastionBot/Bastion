/**
 * @file overwatch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

// const moment = xrequire('moment');

exports.exec = async (Bastion, message, args) => {
  if (!args.battletag) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (args.region && !/^(us|eu|kr|cn)$/.test(args.region.toLowerCase())) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidRegion', '`US`, `EU`, `KR` and `CN`'), message.channel);
  }
  if (args.platform && !/^(pc|psn|xbl)$/.test(args.platform.toLowerCase())) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidPlatform', '`PC`, `PSN`, `XBL`'), message.channel);
  }


  let stats = await Bastion.methods.makeBWAPIRequest(`/gamestats/overwatch/${args.platform}/${args.region}/${args.battletag.replace('#', '-')}`);

  if (stats.error) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'player'), message.channel);
  }

  let fieldsData = [
    {
      name: 'Level',
      value: stats.prestige * 100 + stats.level,
      inline: true
    },
    {
      name: 'Rating',
      value: stats.rating ? stats.rating : '-',
      inline: true
    },
    {
      name: 'Endorsement Level',
      value: stats.endorsement,
      inline: true
    }
  ];

  if (stats.private) {
    fieldsData.push({
      name: 'THIS PROFILE IS PRIVATE',
      value: 'Stats of private profiles can\'t be shown.\nProfiles are set to private by default. You can modify this setting in Overwatch under Options – Social.'
    });
  }
  else {
    fieldsData.push(
      {
        name: 'Games Won',
        value: stats.gamesWon,
        inline: true
      }
    );
  }

  if (Object.keys(stats.quickPlayStats).length > 2) {
    fieldsData.push(
      {
        name: 'Quick Play',
        value: `${args.battletag} has won **${stats.quickPlayStats.games.won}** games.`
      },
      {
        name: 'Match Awards',
        value: `**${stats.quickPlayStats.awards.cards}** Cards\n**${stats.quickPlayStats.awards.medals}** Medals`,
        inline: true
      },
      {
        name: 'Medals',
        value: `**${stats.quickPlayStats.awards.medalsBronze}** Bronze Medals\n**${stats.quickPlayStats.awards.medalsSilver}** Silver Medals\n**${stats.quickPlayStats.awards.medalsGold}** Gold Medals`,
        inline: true
      }
    );
  }
  if (Object.keys(stats.competitiveStats).length > 2) {
    fieldsData.push(
      {
        name: 'Competitive',
        value: `${args.battletag} has won **${stats.competitiveStats.games.won}** games out of **${stats.competitiveStats.games.played}** games played.`
      },
      {
        name: 'Match Awards',
        value: `**${stats.competitiveStats.awards.cards}** Cards\n**${stats.competitiveStats.awards.medals}** Medals`,
        inline: true
      },
      {
        name: 'Medals',
        value: `**${stats.competitiveStats.awards.medalsBronze}** Bronze Medals\n**${stats.competitiveStats.awards.medalsSilver}** Silver Medals\n**${stats.competitiveStats.awards.medalsGold}** Gold Medals`,
        inline: true
      }
    );
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: args.battletag,
        url: `https://playoverwatch.com/en-us/career/${args.platform}/${args.region}/${args.battletag.replace('#', '-')}`,
        icon_url: stats.ratingIcon ? stats.ratingIcon : stats.levelIcon
      },
      fields: fieldsData,
      thumbnail: {
        url: stats.icon ? stats.icon : 'http://i.imgur.com/YZ4w2ey.png'
      }
    }
  });
};

exports.config = {
  aliases: [ 'ow' ],
  enabled: true,
  argsDefinitions: [
    { name: 'battletag', type: String, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'pc' },
    { name: 'region', type: String, alias: 'r', defaultValue: 'us' }
  ]
};

exports.help = {
  name: 'overwatch',
  description: 'Get stats of any Overwatch player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'overwatch <BattleTag> [-r region] [-p platform]',
  example: [ 'overwatch k3rn31p4nic#1122', 'overwatch k3rn31p4nic#1122 -r EU', 'overwatch k3rn31p4nic#1122 -r US -p PC' ]
};
