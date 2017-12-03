/**
 * @file callOfDuty4 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COD4 = require('gamedig');

exports.exec = (Bastion, message, args) => {
  if (args.length < 1 || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args = args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.split(':');
  let host = args[0];

  if (host === '127.0.0.1') {
    return message.channel.send({
      embed: {
        description: 'There is no place like `127.0.0.1`'
      }
    });
  }

  let port;
  if (args[1]) {
    port = parseInt(args[1]);
  }
  else {
    port = 28960;
  }

  COD4.query({
    type: 'cod4',
    host: host,
    port: port
  }).then(data => {
    let gametype = '';
    if (data.raw.g_gametype === 'war') {
      gametype = 'Team Deathmatch';
    }
    else if (data.raw.g_gametype === 'dm') {
      gametype = 'Free for All';
    }
    else if (data.raw.g_gametype === 'sd') {
      gametype = 'Search and Destroy';
    }
    else if (data.raw.g_gametype === 'dom') {
      gametype = 'Domination';
    }
    else if (data.raw.g_gametype === 'koth') {
      gametype = 'Headquarters';
    }
    else if (data.raw.g_gametype === 'sab') {
      gametype = 'Sabotage';
    }
    else {
      gametype = data.raw.g_gametype;
    }

    let stats = [
      {
        name: 'Server IP',
        value: `[${host}:${port}](cod4://${host}:${port})`,
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
        name: 'Map/Gametype',
        value: `${data.map.replace('mp_', '').split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1))} - ${gametype}`
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name);
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].frags);
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
        color: Bastion.colors.BLUE,
        title: data.name,
        description: '[Call of Duty 4®: Modern Warfare®](https://store.steampowered.com/app/7940)',
        fields: stats,
        footer: {
          text: `Server Uptime: ${data.raw.uptime}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(() => {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'invalidIPPort', true), message.channel);
  });
};

exports.config = {
  aliases: [ 'cod4' ],
  enabled: true
};

exports.help = {
  name: 'callOfDuty4',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'callOfDuty4 <COD_SERVER_IP>[:PORT]',
  example: [ 'callOfDuty4 139.59.31.128', 'callOfDuty4 139.59.31.128:27016' ]
};
