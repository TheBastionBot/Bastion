/**
 * @file paladins command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const credentials = require('../../settings/credentials.json');
const HiRez = require('hirez.js');
const hirez = new HiRez({
  devId: credentials.HiRezDevId,
  authKey: credentials.HiRezAuthKey
});

// TODO: generate it only when it's being used with a 15 min cooldown.d
(function interval() {
  hirez.paladins.session.generate().catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
  });
  setTimeout(interval, 15 * 60 * 1000);
})();

exports.run = (Bastion, message, args) => {
  if (!args.player) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  hirez.paladins.getPlayer(args.player).then(player => {
    hirez.paladins.getPlayerStatus(args.player).then(playerStatus => {
      hirez.paladins.getChampionRanks(args.player).then(championRanks => {
        playerStatus = playerStatus[0];

        if (playerStatus.status_string.toLowerCase().includes('unknown') || player.length === 0 || championRanks === 0) {
          message.channel.send({
            embed: {
              color: Bastion.colors.red,
              description: `Player **${args.player}** doesn't exist or we don't have any record of them yet.`
            }
          }).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        else {
          player = player[0];
          championRanks = championRanks[0];

          message.channel.send({
            embed: {
              color: Bastion.colors.blue,
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
            Bastion.log.error(e.stack);
          });
        }
      });
    });
  });
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
  description: 'Get detailed status of any Paladins player.',
  botPermission: '',
  userPermission: '',
  usage: 'paladins <player_name>',
  example: [ 'paladins SaffronPants' ]
};
