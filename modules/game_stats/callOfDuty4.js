/**
 * @file callOfDuty4 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const source = require('gamedig');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args.address)) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.address = args.address.split(':');
    let host = args.address[0];

    if (host === '127.0.0.1') {
      return message.channel.send({
        embed: {
          description: 'There is no place like `127.0.0.1`'
        }
      });
    }

    let port;
    if (args.address[1]) {
      port = parseInt(args.address[1]);
    }
    else {
      port = 28960;
    }

    let data = await source.query({
      type: 'cod4',
      host: host,
      port: port
    });

    let gametypes = {
      war: 'Team Deathmatch',
      dm: 'Free for All',
      sd: 'Search and Destroy',
      dom: 'Domination',
      koth: 'Headquarters',
      sab: 'Sabotage'
    };

    let gametype;
    if (gametypes.hasOwnProperty(data.raw.g_gametype)) {
      gametype = gametypes[data.raw.g_gametype];
    }
    else {
      gametype = data.raw.g_gametype;
    }

    let stats = [
      {
        name: 'Server IP',
        value: `\`${host}:${port}\``,
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
      let pings = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name);
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].frags);
      }
      for (let i = 0; i < data.players.length; i++) {
        pings.push(`${data.players[i].ping}ms`);
      }
      stats.push(
        {
          name: 'Player',
          value: `\`\`\`http\n${players.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Score',
          value: `\`\`\`http\n${scores.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Ping',
          value: `\`\`\`http\n${pings.join('\n')}\`\`\``,
          inline: true
        },
        {
          name: 'Join',
          value: `<cod4://${host}:${port}>`
        }
      );
    }

    let footer;
    if (data.password) {
      footer = {
        text: `Private Server • Uptime: ${data.raw.uptime}`,
        icon_url: 'https://resources.bastionbot.org/images/lock.png'
      };
    }
    else {
      footer = {
        text: `Server Uptime: ${data.raw.uptime}`
      };
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: data.name,
        description: '[Call of Duty 4®: Modern Warfare®](https://store.steampowered.com/app/7940)',
        fields: stats,
        footer: footer
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.toString() === 'UDP Watchdog Timeout') {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'invalidIPPort', true), message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'cod4' ],
  enabled: true,
  argsDefinitions: [
    { name: 'address', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'callOfDuty4',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'callOfDuty4 <COD_SERVER_IP:PORT>',
  example: [ 'callOfDuty4 139.59.31.128:27016' ]
};
