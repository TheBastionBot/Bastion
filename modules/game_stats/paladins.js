/**
 * @file paladins command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const credentials = require('../../settings/credentials.json');
const HiRez = require('hirez.js');
const hirez = new HiRez({
  devId: credentials.HiRezDevId,
  authKey: credentials.HiRezAuthKey
});

let generatedSession = null;

exports.run = (Bastion, message, args) => {
  if (!args.player) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!generatedSession) {
    hirez.paladins.session.generate().then(session => {
      generatedSession = session;
      fetchAndSend(message, args);
      setTimeout(() => {
        generatedSession = null;
      }, 15 * 60 * 1000);
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    fetchAndSend(message, args);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, alias: 'p', defaultOption: true }
  ]
};

exports.help = {
  name: 'paladins',
  description: string('paladins', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'paladins <player_name>',
  example: [ 'paladins SaffronPants' ]
};

/**
 * Fetches a player's Paladins stats and sends it.
 * @function fetchAndSend
 * @param {Object} message The message object
 * @param {Object} args The args object
 * @returns {void}
 */
function fetchAndSend(message, args) {
  hirez.paladins.getPlayer(args.player).then(player => {
    hirez.paladins.getPlayerStatus(args.player).then(playerStatus => {
      hirez.paladins.getChampionRanks(args.player).then(championRanks => {
        playerStatus = playerStatus[0];

        if (playerStatus.status_string.toLowerCase().includes('unknown') || player.length === 0 || championRanks === 0) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          message.client.emit('error', string('notFound', 'errors'), `Player **${args.player}** doesn't exist or we don't have any record of them yet.`, message.channel);
        }
        else {
          player = player[0];
          championRanks = championRanks[0];

          message.channel.send({
            embed: {
              color: message.client.colors.blue,
              author: {
                name: player.Name
              },
              description: playerStatus.status_string.toLowerCase().includes('offline') ? `${playerStatus.status_string} - Last Seen: ${player.Last_Login_Datetime}` : playerStatus.status_string,
              fields: [
                {
                  name: 'Level',
                  value: `${player.Level}`,
                  inline: true
                },
                {
                  name: 'Mastery Level',
                  value: `${player.MasteryLevel}`,
                  inline: true
                },
                {
                  name: 'Region',
                  value: player.Region,
                  inline: true
                },
                {
                  name: 'Wins',
                  value: `${player.Wins}`,
                  inline: true
                },
                {
                  name: 'Losses',
                  value: `${player.Losses}`,
                  inline: true
                },
                {
                  name: 'Leaves',
                  value: `${player.Leaves}`,
                  inline: true
                },
                {
                  name: 'Win %',
                  value: `${player.Wins / (player.Wins + player.Losses) * 100}`,
                  inline: true
                },
                {
                  name: 'Total Achievements',
                  value: `${player.Total_Achievements}`,
                  inline: true
                },
                {
                  name: 'Main Champion',
                  value: `${championRanks.champion} - Level ${championRanks.Rank}\n` +
                  `${championRanks.Kills} Kills, ${championRanks.Deaths} Deaths and ${championRanks.Assists} Assists (${(championRanks.Kills / championRanks.Deaths).toFixed(2)} K/D)\n` +
                  `${championRanks.Wins} Wins and ${championRanks.Losses} Losses (${(championRanks.Wins / (championRanks.Wins + championRanks.Losses) * 100).toFixed(2)} Win %)`,
                  inline: true
                }
              ],
              footer: {
                text: 'Powered by Hi-Rez Studios'
              }
            }
          }).catch(e => {
            message.client.log.error(e);
          });
        }
      }).catch(e => {
        message.client.log.error(e);
      });
    }).catch(e => {
      message.client.log.error(e);
    });
  }).catch(e => {
    message.client.log.error(e);
  });
}
