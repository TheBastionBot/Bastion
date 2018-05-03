/**
 * @file destiny2 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    let membershipType = -1;

    let options = {
      headers: {
        'X-API-Key': `${Bastion.credentials.bungieAPIKey}`
      },
      url: `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(args.name)}/`,
      json: true
    };
    let player = await request(options);

    if (player.ErrorCode !== 1) {
      return Bastion.emit('error', player.ErrorStatus, player.Message, message.channel);
    }
    if (!player.Response.length) {
      return Bastion.emit('error', 'Not Found', 'No players were found for the given name.', message.channel);
    }

    player = player.Response[0];

    options = {
      headers: {
        'X-API-Key': `${Bastion.credentials.bungieAPIKey}`
      },
      url: `https://www.bungie.net/Platform/Destiny2/${player.membershipType}/Account/${player.membershipId}/Stats?groups=General,Medals`,
      json: true
    };
    let stats = await request(options);
    if (stats.ErrorCode !== 1) {
      return Bastion.emit('error', stats.ErrorStatus, stats.Message, message.channel);
    }

    stats = stats.Response.mergedAllCharacters.merged.allTime;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: player.displayName,
        description: `Played for ${stats.secondsPlayed.basic.displayValue} and has an efficiency of ${stats.efficiency.basic.displayValue}.`,
        fields: [
          {
            name: 'Highest Character Level',
            value: stats.highestCharacterLevel.basic.displayValue,
            inline: true
          },
          {
            name: 'Highest Light Level',
            value: stats.highestLightLevel.basic.displayValue,
            inline: true
          },
          {
            name: 'Win Loss Ratio',
            value: stats.winLossRatio.basic.displayValue,
            inline: true
          },
          {
            name: 'Combat Rating',
            value: stats.combatRating.basic.displayValue,
            inline: true
          },
          {
            name: 'Score',
            value: stats.score.basic.displayValue,
            inline: true
          },
          {
            name: 'Team Score',
            value: stats.teamScore.basic.displayValue,
            inline: true
          },
          {
            name: 'Kills',
            value: `${stats.kills.basic.displayValue} (${stats.precisionKills.basic.displayValue} Precision Kills)`,
            inline: true
          },
          {
            name: 'Assists',
            value: stats.assists.basic.displayValue,
            inline: true
          },
          {
            name: 'Deaths',
            value: `${stats.deaths.basic.displayValue} (${stats.suicides.basic.displayValue} Suicides)`,
            inline: true
          },
          {
            name: 'KDR',
            value: stats.killsDeathsRatio.basic.displayValue,
            inline: true
          },
          {
            name: 'KDA',
            value: stats.killsDeathsAssists.basic.displayValue,
            inline: true
          },
          {
            name: 'KAD',
            value: `${((stats.kills.basic.value + stats.assists.basic.value) / stats.deaths.basic.value).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Best Weapon Type',
            value: stats.weaponBestType.basic.displayValue,
            inline: true
          },
          {
            name: 'Total Medals Earned',
            value: stats.allMedalsEarned.basic.displayValue,
            inline: true
          },
          {
            name: 'Extras',
            value: `${stats.objectivesCompleted.basic.displayValue} Objectives Completed\n${stats.adventuresCompleted.basic.displayValue} Adventures Completed\n${stats.heroicPublicEventsCompleted.basic.displayValue} Heroic Public Events Completed`
          }
        ],
        thumbnail: {
          url: 'https://i.imgur.com/QY1VTfB.jpg'
        },
        footer: {
          text: 'Powered by Bungie'
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'pc' }
  ]
};

exports.help = {
  name: 'destiny2',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'destiny2 <BattleTag | PlayerName>',
  example: [ 'destiny2 Antagonize#1538' ]
};
