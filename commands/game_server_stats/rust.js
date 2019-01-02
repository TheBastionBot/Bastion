/**
 * @file rust command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const source = xrequire('gamedig');

exports.exec = async (Bastion, message, args) => {
  if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args.address)) {
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

  let port = args.address[1] ? parseInt(args.address[1]) : 28015;

  let data = await source.query({
    type: 'rust',
    host: host,
    port: port
  });

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
      name: 'Map',
      value: data.map
    }
  ];

  if (data.players.length) {
    let players = [];
    let scores = [];
    let playtimes = [];
    for (let i = 0; i < data.players.length; i++) {
      players.push(data.players[i].name);
    }
    for (let i = 0; i < data.players.length; i++) {
      scores.push(data.players[i].score);
    }
    for (let i = 0; i < data.players.length; i++) {
      playtimes.push(`${parseInt(data.players[i].time)}s`);
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
        name: 'Playtime',
        value: `\`\`\`http\n${playtimes.join('\n')}\`\`\``,
        inline: true
      },
      {
        name: 'Join',
        value: `<steam://connect/${host}:${port}>`
      }
    );
  }

  let footer;
  if (data.password) {
    footer = {
      text: 'Private Server',
      icon_url: 'https://resources.bastionbot.org/images/lock.png'
    };
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: data.name,
      description: '[Rust](https://store.steampowered.com/app/252490/)',
      fields: stats,
      footer: footer
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'address', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'rust',
  description: 'Get stats of any Rust game server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rust <RUST_SERVER_IP:PORT>',
  example: [ 'rust 139.59.13.119:28015' ]
};
