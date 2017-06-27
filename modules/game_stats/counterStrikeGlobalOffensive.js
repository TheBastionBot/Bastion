/**
 * @file counterStrikeGlobalOffensive command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const CSGO = require('gamequery');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args = args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.split(':');
  let host = args[0];
  let port;
  if (args[1]) {
    port = parseInt(args[1]);
  }
  else {
    port = 27015;
  }

  CSGO.query({
    type: 'csgo',
    host: host,
    port: port
  }).then(data => {
    let stats = [
      {
        name: 'Server IP',
        value: `[${host}:${port}](steam://connect/${host}:${port})`,
        inline: true
      },
      {
        name: 'Private',
        value: data.password,
        inline: true
      },
      {
        name: 'Players',
        value: `${data.players.length}/${data.maxplayers}`,
        inline: true
      },
      {
        name: 'Map',
        value: data.map
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name);
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].score);
      }
      stats.push(
        {
          name: 'Player',
          value: players.join('\n'),
          inline: true
        },
        {
          name: 'Score',
          value: scores.join('\n'),
          inline: true
        }
      );
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: data.name,
        description: '[Counter-Strike: Global Offensive](https://store.steampowered.com/app/730/)',
        fields: stats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(() => {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('connectionError', 'errors'), 'Can\'t get stats from the specified server. Please check the IP address and PORT number and if the server is online before trying again.', message.channel);
  });
};

exports.config = {
  aliases: [ 'csgo' ],
  enabled: true
};

exports.help = {
  name: 'counterstrikeglobaloffensive',
  description: string('counterStrikeGlobalOffensive', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'counterStrikeGlobalOffensive <CSGO_SERVER_IP>[:PORT]',
  example: [ 'counterStrikeGlobalOffensive 139.59.31.128', 'counterStrikeGlobalOffensive 139.59.31.128:27016' ]
};
