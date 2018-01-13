/**
 * @file smite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const credentials = require('../../settings/credentials.json');
const HiRez = require('hirez.js');
const hirez = new HiRez({
  devId: credentials.HiRezDevId,
  authKey: credentials.HiRezAuthKey
});

let generatedSession = null;

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.player) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (!generatedSession) {
      let session = await hirez.smite('pc').session.generate().catch(e => {
        Bastion.log.error(e);
      });
      generatedSession = session;

      setTimeout(() => {
        generatedSession = null;
      }, 15 * 60 * 1000);
    }

    fetchAndSend(message, args);
  }
  catch (e) {
    Bastion.log.error(e);
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
  name: 'smite',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'smite <player_name>',
  example: [ 'smite SaffronPants' ]
};

/**
 * Fetches a player's smite stats and sends it.
 * @function fetchAndSend
 * @param {Object} message The message object
 * @param {Object} args The args object
 * @returns {void}
 */
async function fetchAndSend(message, args) {
  try {
    let player = await hirez.smite('pc').getPlayer(args.player);
    let playerStatus = await hirez.smite('pc').getPlayerStatus(args.player);
    let godRanks = await hirez.smite('pc').getGodRanks(args.player);

    playerStatus = playerStatus[0];

    if (playerStatus.status_string.toLowerCase().includes('unknown') || player.length === 0 || godRanks === 0) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return message.client.emit('error', message.client.strings.error(message.guild.language, 'notFound'), message.client.strings.error(message.guild.language, 'notFound', true, 'player'), message.channel);
    }

    player = player[0];
    godRanks = godRanks[0];

    message.channel.send({
      embed: {
        color: message.client.colors.BLUE,
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
            name: 'Main God',
            value: `${godRanks.god} - Level ${godRanks.Rank}\n` +
            `${godRanks.Kills} Kills, ${godRanks.Deaths} Deaths and ${godRanks.Assists} Assists (${(godRanks.Kills / godRanks.Deaths).toFixed(2)} K/D)\n` +
            `${godRanks.Wins} Wins and ${godRanks.Losses} Losses (${(godRanks.Wins / (godRanks.Wins + godRanks.Losses) * 100).toFixed(2)} Win %)`,
            inline: true
          }
        ],
        footer: {
          text: 'Powered by Hi-Rez Studios'
        }
      }
    });
  }
  catch (e) {
    message.client.log.error(e);
  }
}
