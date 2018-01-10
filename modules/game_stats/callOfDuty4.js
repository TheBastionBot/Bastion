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
      gametype = 'FFA';
    }
    else if (data.raw.g_gametype === 'sd') {
      gametype = 'S&D';
    }
    else if (data.raw.g_gametype === 'dom') {
      gametype = 'DOM';
    }
    else if (data.raw.g_gametype === 'koth') {
      gametype = 'HQ';
    }
    else if (data.raw.g_gametype === 'sab') {
      gametype = 'SAB';
    }
    else {
      gametype = data.raw.g_gametype;
    }

    let stats = [
      {
        name: 'Address',
        value: '`' + host + ':' + port + '`',
        inline: true
      },
      {
        name: 'Players',
        value: '`' + data.players.length + '/' + data.maxplayers + '`',
        inline: true
      },
      {
        name: 'Map',
        value: '`' + data.map.replace('mp_', '').split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1)) + ' - ' + gametype + '`',
        inline: true
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      let pings = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name.substring(0, 12));
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].frags);
      }
      for (let i = 0; i < data.players.length; i++) {
        pings.push(data.players[i].ping);
      }
      stats.push(
        {
          name: 'Player Name',
          value: '```http\n' + players.join('\n') + '```',
          inline: true
        },
        {
          name: 'Score',
          value: '```http\n' + scores.join('\n') + '```',
          inline: true
        },
        {
          name: 'Ping',
          value: '```http\n' + pings.join('\n') + '```',
          inline: true
        }
      );
    }

    let lock = data.password;
    let lock_icon = '';
    if (lock == true) {
      lock = 'Password required to join server | ';
      lock_icon = 'https://resources.bastionbot.org/images/lock.png';
    } 
    else {
       lock = '';
       lock_icon = '';
    }
    
    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: data.name,
        description: '[Call of Duty 4®: Modern Warfare®](https://store.steampowered.com/app/7940)',
        fields: stats,
        footer: {
          text: lock + `Server Uptime: ${data.raw.uptime}`,
          icon_url: lock_icon
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
