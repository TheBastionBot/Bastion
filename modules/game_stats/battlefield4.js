/**
 * @file battlefield4 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      url: `https://api.bf4stats.com/api/playerInfo?plat=${args.platform}&name=${args.name}&output=json`,
      json: true
    };
    let response = await request(options);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: `[${response.player.tag}] ${response.player.name}`,
          url: response.player.blPlayer
        },
        title: 'Battlefield 4 - Stats',
        description: `Played ${(response.player.timePlayed / 60 / 60).toFixed(2)} hours`,
        fields: [
          {
            name: 'Country',
            value: `:flag_${response.player.country.toLowerCase()}: ${response.player.countryName}`,
            inline: true
          },
          {
            name: 'Rank',
            value: `${response.player.rank.nr} - ${response.player.rank.name}`,
            inline: true
          },
          {
            name: 'Score',
            value: `${response.player.score}`,
            inline: true
          },
          {
            name: 'Skill',
            value: `${response.stats.skill}`,
            inline: true
          },
          {
            name: 'SPM',
            value: `${(response.stats.extra.spm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'KPM',
            value: `${(response.stats.extra.kpm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Wins',
            value: `${response.stats.numWins}`,
            inline: true
          },
          {
            name: 'Losses',
            value: `${response.stats.numLosses}`,
            inline: true
          },
          {
            name: 'W/L',
            value: `${(response.stats.extra.wlr).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Kills',
            value: `${response.stats.kills}`,
            inline: true
          },
          {
            name: 'Deaths',
            value: `${response.stats.deaths}`,
            inline: true
          },
          {
            name: 'K/D',
            value: `${(response.stats.extra.kdr).toFixed(2)}`,
            inline: true
          }
        ],
        thumbnail: {
          url: 'https://i.imgur.com/ox55mLK.jpg'
        },
        footer: {
          text: 'Powered by Battlefield'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'bf4' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'pc' }
  ]
};

exports.help = {
  name: 'battlefield4',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'battlefield4 <player_name>',
  example: [ 'battlefield4 VVipe' ]
};
