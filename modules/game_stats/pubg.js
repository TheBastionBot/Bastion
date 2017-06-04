/**
 * @file pubg command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.run = (Bastion, message, args) => {
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

  request({
    headers: {
      'TRN-Api-Key': Bastion.credentials.TRNApiKey
    },
    uri: `https://pubgtracker.com/api/profile/pc/${args.player}`
  }, function (err, response, body) {
    let player, avatar, color, title = '', description = '', data = [];

    if (err) {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the server. Please try again later.';
    }
    else if (response.statusCode === 200) {
      color = Bastion.colors.blue;
      try {
        body = JSON.parse(body);
        if (body.AccountId) {
          player = body.PlayerName;
          avatar = body.Avatar;

          body.Stats = body.Stats.filter(s => s.Region === args.region);
          body.Stats = body.Stats.filter(s => s.Match === args.mode.toLowerCase());

          if (body.Stats.length <= 0) {
            color = Bastion.colors.red;
            description = `Unable to find any stats for the player **${args.player}** in **${args.mode}** game mode.`;
          }
          else {
            let performance = body.Stats[0].Stats.filter(s => s.category === 'Performance');
            let rating = body.Stats[0].Stats.filter(s => s.category === 'Skill Rating');
            let perGame = body.Stats[0].Stats.filter(s => s.category === 'Per Game');
            let combat = body.Stats[0].Stats.filter(s => s.category === 'Combat');
            let survival = body.Stats[0].Stats.filter(s => s.category === 'Survival');
            let distance = body.Stats[0].Stats.filter(s => s.category === 'Distance');
            let support = body.Stats[0].Stats.filter(s => s.category === 'Support');

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
                  value: body.selectedRegion.toUpperCase(),
                  inline: true
                },
                {
                  name: 'Default Season',
                  value: body.defaultSeason,
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
        }
        else {
          color = Bastion.colors.red;
          description = `Unable to find the player **${args.player}**.`;
        }
      }
      catch (e) {
        color = Bastion.colors.red;
        description = 'Some error has occured while parsing the received data. Please try again later.';
      }
    }
    else {
      color = Bastion.colors.red;
      description = 'Some error has occured while getting data from the servers.';
      data = [
        {
          name: `${response.statusCode}`,
          value: response.statusMessage
        }
      ];
    }

    message.channel.send({
      embed: {
        color: color,
        author: {
          name: player,
          icon_url: avatar || '',
          url: `https://pubgtracker.com/profile/pc/${args.player}/${args.mode}?region=${args.region}`
        },
        title: title,
        description: description,
        fields: data,
        footer: {
          text: 'Powered by PlayerUnknown\'s Battlegrounds'
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
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
  description: 'Get detailed status of any PlayerUnknown\'s Battlegrounds player.',
  botPermission: '',
  userPermission: '',
  usage: 'pubg <player_name> <-m mode> [-c category]',
  example: [ 'pubg vvipe -m squad', 'pubg spark -m duo -c Performance' ]
};
