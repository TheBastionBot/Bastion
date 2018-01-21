/**
 * @file pubg command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.player || !args.mode) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (/^(na|eu|as|oc|sa)$/.test(args.region.toLowerCase())) {
      args.region = 'agg';
    }

    let options = {
      headers: {
        'TRN-Api-Key': Bastion.credentials.PUBGAPIKey
      },
      url: `https://pubgtracker.com/api/profile/pc/${args.player}`,
      json: true
    };
    let response = await request(options);

    if (response.AccountId) {
      let title = '', data = [];

      response.Stats = response.Stats.filter(s => s.Region === args.region);
      response.Stats = response.Stats.filter(s => s.Match === args.mode.toLowerCase());

      if (response.Stats.length <= 0) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'playerModeMismatch', true, args.player, args.mode), message.channel);
      }
      else {
        let performance = response.Stats[0].Stats.filter(s => s.category === 'Performance');
        let rating = response.Stats[0].Stats.filter(s => s.category === 'Skill Rating');
        let perGame = response.Stats[0].Stats.filter(s => s.category === 'Per Game');
        let combat = response.Stats[0].Stats.filter(s => s.category === 'Combat');
        let survival = response.Stats[0].Stats.filter(s => s.category === 'Survival');
        let distance = response.Stats[0].Stats.filter(s => s.category === 'Distance');
        let support = response.Stats[0].Stats.filter(s => s.category === 'Support');

        if (args.category) {
          args.category = args.category.join(' ');

          if (args.category.toLowerCase() === 'performance') {
            title = 'Performance';
            for (let i = 0; i < performance.length; i ++) {
              data.push({
                name: performance[i].label,
                value: `${performance[i].displayValue} [Top ${performance[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'skill rating') {
            title = 'Skill Rating';
            for (let i = 0; i < rating.length; i ++) {
              data.push({
                name: rating[i].label,
                value: `${rating[i].displayValue} [Top ${rating[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'per game') {
            title = 'Per Game';
            for (let i = 0; i < perGame.length; i ++) {
              data.push({
                name: perGame[i].label,
                value: `${perGame[i].displayValue} [Top ${perGame[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'combat') {
            title = 'Combat';
            for (let i = 0; i < combat.length; i ++) {
              data.push({
                name: combat[i].label,
                value: `${combat[i].displayValue} [Top ${combat[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'survival') {
            title = 'Survival';
            for (let i = 0; i < survival.length; i ++) {
              data.push({
                name: survival[i].label,
                value: `${survival[i].displayValue} [Top ${survival[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'distance') {
            title = 'Distance';
            for (let i = 0; i < distance.length; i ++) {
              data.push({
                name: distance[i].label,
                value: `${distance[i].displayValue} [Top ${distance[i].percentile}%]`,
                inline: true
              });
            }
          }
          else if (args.category.toLowerCase() === 'support') {
            title = 'Support';
            for (let i = 0; i < support.length; i ++) {
              data.push({
                name: support[i].label,
                value: `${support[i].displayValue} [Top ${support[i].percentile}%]`,
                inline: true
              });
            }
          }
        }
        else {
          data = [
            {
              name: 'Selected Region',
              value: response.selectedRegion.toUpperCase(),
              inline: true
            },
            {
              name: 'Default Season',
              value: response.defaultSeason,
              inline: true
            },
            {
              name: rating[0].label,
              value: `${rating[0].displayValue} - #${rating[0].rank} in ${args.region.toUpperCase()} - Top ${rating[0].percentile}%`
            },
            {
              name: performance[0].label,
              value: performance[0].displayValue,
              inline: true
            },
            {
              name: performance[1].label,
              value: performance[1].displayValue,
              inline: true
            },
            {
              name: performance[3].label,
              value: performance[3].displayValue,
              inline: true
            }
          ];
        }
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          author: {
            name: response.PlayerName,
            icon_url: response.Avatar,
            url: `https://pubgtracker.com/profile/pc/${args.player}/${args.mode}?region=${args.region}`
          },
          title: title,
          fields: data,
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
    { name: 'region', type: String, alias: 'r', defaultValue: 'agg' },
    { name: 'mode', type: String, alias: 'm' },
    { name: 'category', type: String, alias: 'c', multiple: true }
  ]
};

exports.help = {
  name: 'pubg',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pubg <player_name> <-m solo/duo/squad> [-c Performance/Skill Rating/Per Game/Combat/Survival/Distance/Support]',
  example: [ 'pubg vvipe -m squad', 'pubg spark -m duo -c Performance' ]
};
