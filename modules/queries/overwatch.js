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

const urllib = require('urllib');

exports.run = function(Bastion, message, args) {
  if (args.length != 2) return;

  for (let i = 0; i < args.length - 1; i++)
    args[i] = args[i].toLowerCase();
  if (!/^(us|eu|kr|cn|global)$/.test(args[0])) args[0] = 'global';
  if (!/^\w{3,12}#\d{4,6}$/.test(args[1])) return;

  urllib.request(`http://ow-api.herokuapp.com/profile/pc/${args[0]}/${args[1].replace('#', '-')}`, function (err, data) {
    let embed = {};
    if (data.toString() == 'Not Found') {
      embed = {embed: {
        color: 13380644,
        description: `No user with BattleTag **${args[1]}** was not found in **${args[0].toUpperCase()}** region.`
      }};
    }
    else {
      data = JSON.parse(data);
      if (data.competitive.rank == null) {
        embed = {embed: {
          color: 6651610,
          title: args[1],
          fields: [
            {
              name: 'Quick Play',
              value: `**Wins:** ${data.games.quickplay.wins}\n**Playtime:** ${data.playtime.quickplay}`,
              inline: true
            },
            {
              name: 'Competitive Play',
              value: 'No competitive play',
              inline: true
            }
          ],
          thumbnail: {
            url: 'http://i.imgur.com/YZ4w2ey.png'
          }
        }};
      }
      else {
        embed = {embed: {
          color: 6651610,
          title: args[1],
          url: `https://playoverwatch.com/en-us/career/pc/${args[0]}/${args[1].replace('#', '-')}`,
          fields: [
            {
              name: 'Quick Play',
              value: `**Wins:** ${data.games.quickplay.wins}\n**Playtime:** ${data.playtime.quickplay}`,
              inline: true
            },
            {
              name: 'Competitive Play',
              value: `**Rank:** ${data.competitive.rank}\n**Wins:** ${data.games.competitive.wins}\n**Loses:** ${data.games.competitive.lost}\n**Played:** ${data.games.competitive.played}\n**Playtime:** ${data.playtime.competitive}`,
              inline: true
            }
          ],
          thumbnail: {
            url: data.competitive.rank_img
          }
        }};
      }
    }
    message.channel.sendMessage('', embed).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.conf = {
  aliases: ['ow']
};

exports.help = {
  name: 'overwatch',
  description: 'Shows Overwatch player stats specified by his Region and BattleTag.',
  permission: '',
  usage: 'overwatch <BattleTag#discriminator>',
  example: ['overwatch GH0S7#11143']
};
