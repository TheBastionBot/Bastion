/**
 * @file overwatch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const ow = require('overwatch-js');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args[0] = args[0].toLowerCase();
  if (!/^(us|eu|kr|cn)$/.test(args[0].toLowerCase())) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Invalid Data', `**${args[0]}** is not a valid region. Valid regions are \`US\`, \`EU\`, \`KR\` and \`CN\`.`, message.channel);
  }
  if (!/^\w{3,12}(#|-)\d{4,6}$/.test(args[1])) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Invalid Data', `**${args[1]}** is not a valid BattleTag.`, message.channel);
  }

  ow.getAll('pc', args[0], args[1].replace('#', '-')).then(data => {
    let stats = [
      {
        name: 'Level',
        value: data.profile.level,
        inline: true
      },
      {
        name: 'Rank',
        value: `${parseInt(data.profile.rank) ? data.profile.rank : '-'}`,
        inline: true
      }
    ];
    if (data.profile.hasOwnProperty('season')) {
      stats.push(
        {
          name: 'Season ID',
          value: `${data.profile.season.id}`,
          inline: true
        },
        {
          name: 'Season Rank',
          value: `${data.profile.season.rank}`,
          inline: true
        }
      );
    }
    stats.push(
      {
        name: 'Quick Play',
        value: `${args[1]} has won **${data.quickplay.global.games_won}** games.`
      },
      {
        name: 'Eliminations - Average',
        value: `${data.quickplay.global.eliminations_average}`,
        inline: true
      },
      {
        name: 'Damage Done - Average',
        value: `${data.quickplay.global.damage_done_average}`,
        inline: true
      },
      {
        name: 'Deaths - Average',
        value: `${data.quickplay.global.deaths_average}`,
        inline: true
      },
      {
        name: 'Final Blows - Average',
        value: `${data.quickplay.global.final_blows_average}`,
        inline: true
      },
      {
        name: 'Healing Done - Average',
        value: `${data.quickplay.global.healing_done_average}`,
        inline: true
      },
      {
        name: 'Objective Kills - Average',
        value: `${data.quickplay.global.objective_kills_average}`,
        inline: true
      },
      {
        name: 'Objective Time - Average',
        value: `${data.quickplay.global.objective_time_average}`,
        inline: true
      },
      {
        name: 'Solo Kills - Average',
        value: `${data.quickplay.global.solo_kills_average}`,
        inline: true
      }
    );
    if (Object.keys(data.competitive.global).length > 1) {
      stats.push(
        {
          name: 'Competitive',
          value: `${args[1]} has won **${data.competitive.global.games_won}** games out of **${data.competitive.global.games_played}** played games.`
        },
        {
          name: 'Eliminations - Average',
          value: `${data.competitive.global.eliminations_average}`,
          inline: true
        },
        {
          name: 'Damage Done - Average',
          value: `${data.competitive.global.damage_done_average}`,
          inline: true
        },
        {
          name: 'Deaths - Average',
          value: `${data.competitive.global.deaths_average}`,
          inline: true
        },
        {
          name: 'Final Blows - Average',
          value: `${data.competitive.global.final_blows_average}`,
          inline: true
        },
        {
          name: 'Healing Done - Average',
          value: `${data.competitive.global.healing_done_average}`,
          inline: true
        },
        {
          name: 'Objective Kills - Average',
          value: `${data.competitive.global.objective_kills_average}`,
          inline: true
        },
        {
          name: 'Objective Time - Average',
          value: `${data.competitive.global.objective_time_average}`,
          inline: true
        },
        {
          name: 'Solo Kills - Average',
          value: `${data.competitive.global.solo_kills_average}`,
          inline: true
        }
      );
    }
    stats.push({
      name: 'Achievements',
      value: data.achievements.filter(a => a.acquired === true).map(a => a.title).join(', ') || '-'
    });
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        author: {
          name: args[1],
          url: data.profile.url,
          icon_url: parseInt(data.profile.rank) ? data.profile.rankPicture : 'http://i.imgur.com/YZ4w2ey.png'
        },
        fields: stats,
        thumbnail: {
          url: data.profile.avatar !== '' ? data.profile.avatar : 'http://i.imgur.com/YZ4w2ey.png'
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    if (e.stack.includes('NOT_FOUND')) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', 'Not Found', `No player with BattleTag **${args[1]}** found in the region **${args[0].toUpperCase()}**.`, message.channel);
    }
  });
};

exports.config = {
  aliases: [ 'ow' ],
  enabled: true
};

exports.help = {
  name: 'overwatch',
  description: string('overwatch', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'overwatch <region> <BattleTag#discriminator>',
  example: [ 'overwatch us GH0S7#11143' ]
};
