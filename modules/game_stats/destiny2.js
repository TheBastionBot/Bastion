/**
 * @file destiny2 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  let membershipType = -1;
  request({
    headers: {
      'X-API-Key': `${Bastion.credentials.bungieAPIKey}`
    },
    uri: `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(args.name)}/ `
  }, function (err, response, body) {
    try {
      body = JSON.parse(body);
      if (body.ErrorCode !== 1) {
        return Bastion.emit('error', body.ErrorStatus, body.Message, message.channel);
      }
      if (!body.Response.length) {
        return Bastion.emit('error', 'Not Found', 'No players were found for the given name.', message.channel);
      }

      body = body.Response[0];
      let player = body;

      request({
        headers: {
          'X-API-Key': `${Bastion.credentials.bungieAPIKey}`
        },
        uri: `https://www.bungie.net/Platform/Destiny2/${body.membershipType}/Account/${body.membershipId}/Stats?groups=General,Medals`
      }, function (err, response, body) {
        try {
          body = JSON.parse(body);
          if (body.ErrorCode !== 1) {
            return Bastion.emit('error', body.ErrorStatus, body.Message, message.channel);
          }

          body = body.Response.mergedAllCharacters.merged.allTime;

          message.channel.send({
            embed: {
              color: Bastion.colors.BLUE,
              title: player.displayName,
              description: `Played for ${body.secondsPlayed.basic.displayValue} and has an efficiency of ${body.efficiency.basic.displayValue}.`,
              fields: [
                {
                  name: 'Highest Character Level',
                  value: body.highestCharacterLevel.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Highest Light Level',
                  value: body.highestLightLevel.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Win Loss Ratio',
                  value: body.winLossRatio.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Combat Rating',
                  value: body.combatRating.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Score',
                  value: body.score.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Team Score',
                  value: body.teamScore.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Kills',
                  value: `${body.kills.basic.displayValue} (${body.precisionKills.basic.displayValue} Precision Kills)`,
                  inline: true
                },
                {
                  name: 'Assists',
                  value: body.assists.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Deaths',
                  value: `${body.deaths.basic.displayValue} (${body.suicides.basic.displayValue} Suicides)`,
                  inline: true
                },
                {
                  name: 'KDR',
                  value: body.killsDeathsRatio.basic.displayValue,
                  inline: true
                },
                {
                  name: 'KDA',
                  value: body.killsDeathsAssists.basic.displayValue,
                  inline: true
                },
                {
                  name: 'KAD',
                  value: `${((body.kills.basic.value + body.assists.basic.value) / body.deaths.basic.value).toFixed(2)}`,
                  inline: true
                },
                {
                  name: 'Best Weapon Type',
                  value: body.weaponBestType.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Total Medals Earned',
                  value: body.allMedalsEarned.basic.displayValue,
                  inline: true
                },
                {
                  name: 'Extras',
                  value: `${body.objectivesCompleted.basic.displayValue} Objectives Completed\n${body.adventuresCompleted.basic.displayValue} Adventures Completed\n${body.heroicPublicEventsCompleted.basic.displayValue} Heroic Public Events Completed`
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
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'parseError'), Bastion.strings.error(message.guild.language, 'parse', true), message.channel);
        }
      });
    }
    catch (e) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'parseError'), Bastion.strings.error(message.guild.language, 'parse', true), message.channel);
    }
  });
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
