/**
 * @file counterStrikeGlobalOffensive command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const TF2 = require('gamedig');

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
    port = 27015;
  }

  TF2.query({
    type: 'tf2',
    host: host,
    port: port
  }).then(data => {
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
        value: '`' + data.map + '`',
        inline: true
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      let times = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name.substring(0, 12));
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].score);
      }
      for (let i = 0; i < data.players.length; i++) {
        times.push(new Date(data.players[i].time * 1000).toISOString().substr(11, 8));
      }
      stats.push(
        {
          name: 'Player Name',
          value: '```http\n' + players.join('\n') + '\n```',
          inline: true
        },
        {
          name: 'Score',
          value: '```http\n' + scores.join('\n') + '\n```',
          inline: true
        },
        {
          name: 'Time',
          value: '```http\n' + times.join('\n') + '\n```',
          inline: true
        }
        
      );
    }
    
    stats.push(
      {
        name: 'Join Server',
        value: 'steam://connect/' + host + ':' + port,
        inline: false
      }  
    );
    
    let lock = data.password;
    let lock_icon = '';
    if (lock == true) {
      lock = 'Password required to join server';
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
        description: '[' + data.raw.game + '](https://store.steampowered.com/app/' + data.raw.gameid + '/)',
        fields: stats,
        footer: {
          text: lock,
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
  aliases: [ 'tf2' ],
  enabled: true
};

exports.help = {
  name: 'teamFortress2',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'teamFortress2 <TF2_SERVER_IP>[:PORT]',
  example: [ 'teamFortress2 139.59.31.129', 'teamFortress2 139.59.31.129:27019' ]
};
