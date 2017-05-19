/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const ow = require('overwatch-js');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args[0] = args[0].toLowerCase();
  if (!/^(us|eu|kr|cn)$/.test(args[0].toLowerCase())) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `**${args[0]}** is not a valid region. Valid regions are \`US\`, \`EU\`, \`KR\` and \`CN\`.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (!/^\w{3,12}(#|-)\d{4,6}$/.test(args[1])) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `**${args[1]}** is not a valid BattleTag.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
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
    message.channel.send({embed: {
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
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    if (e.stack.includes('NOT_FOUND')) {
      message.channel.send({embed: {
        color: Bastion.colors.red,
        description: `No player with BattleTag **${args[1]}** found in the region **${args[0].toUpperCase()}**.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  });
};

exports.config = {
  aliases: ['ow'],
  enabled: true
};

exports.help = {
  name: 'overwatch',
  description: 'Shows Overwatch player stats specified by his Region and BattleTag.',
  botPermission: '',
  userPermission: '',
  usage: 'overwatch <region> <BattleTag#discriminator>',
  example: ['overwatch us GH0S7#11143']
};
