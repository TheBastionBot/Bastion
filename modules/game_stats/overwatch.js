/**
 * @file overwatch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const ow = require('overwatch-js');

exports.exec = (Bastion, message, args) => {
  if (args.length < 2) {
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
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidRegion', true, '`US`, `EU`, `KR` and `CN`'), message.channel);
  }
  if (!/^\w{3,12}(#|-)\d{4,6}$/.test(args[1])) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'BattleTag'), message.channel);
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
        name: 'Eliminations',
        value: `${data.quickplay.global.eliminations}`,
        inline: true
      },
      {
        name: 'Damage Done',
        value: `${data.quickplay.global.all_damage_done}`,
        inline: true
      },
      {
        name: 'Deaths',
        value: `${data.quickplay.global.deaths}`,
        inline: true
      },
      {
        name: 'Final Blows',
        value: `${data.quickplay.global.final_blows}`,
        inline: true
      },
      {
        name: 'Healing Done',
        value: `${data.quickplay.global.healing_done}`,
        inline: true
      },
      {
        name: 'Objective Kills',
        value: `${data.quickplay.global.objective_kills}`,
        inline: true
      },
      {
        name: 'Objective Time',
        value: `${data.quickplay.global.objective_time}`,
        inline: true
      },
      {
        name: 'Solo Kills',
        value: `${data.quickplay.global.solo_kills}`,
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
          name: 'Eliminations',
          value: `${data.competitive.global.eliminations}`,
          inline: true
        },
        {
          name: 'Damage Done',
          value: `${data.competitive.global.all_damage_done}`,
          inline: true
        },
        {
          name: 'Deaths',
          value: `${data.competitive.global.deaths}`,
          inline: true
        },
        {
          name: 'Final Blows',
          value: `${data.competitive.global.final_blows}`,
          inline: true
        },
        {
          name: 'Healing Done',
          value: `${data.competitive.global.healing_done}`,
          inline: true
        },
        {
          name: 'Objective Kills',
          value: `${data.competitive.global.objective_kills}`,
          inline: true
        },
        {
          name: 'Objective Time',
          value: `${data.competitive.global.objective_time}`,
          inline: true
        },
        {
          name: 'Solo Kills - Average',
          value: `${data.competitive.global.solo_kills}`,
          inline: true
        }
      );
    }
    stats.push({
      name: 'Achievements',
      value: data.achievements.filter(a => a.acquired === true).map(a => a.title).join(', ').substring(0, 1024) || '-'
    });
    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
      Bastion.log.error(e);
    });
  }).catch(e => {
    if (e.stack.includes('PROFILE_NOT_FOUND')) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'player'), message.channel);
    }
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ow' ],
  enabled: true
};

exports.help = {
  name: 'overwatch',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'overwatch <region> <BattleTag#discriminator>',
  example: [ 'overwatch us GH0S7#11143' ]
};
