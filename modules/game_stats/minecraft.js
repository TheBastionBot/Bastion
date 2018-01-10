/**
 * @file minecraft command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const MINECRAFT = require('gamedig');

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
    port = 25565;
  }

  MINECRAFT.query({
    type: 'minecraft',
    host: host,
    port: port
  }).then(data => {
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
        description: '[Minecraft](https://minecraft.net/)',
        fields: [
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
            value: '`' + data.raw.map + '`',
            inline: true
          },
          {
            name: 'Mode',
            value: '`' + data.raw.gametype + '`',
            inline: true
          }
        ],
        footer: {
          text: lock + `Version: ${data.raw.version}`,
          icon_url: lock_icon,
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
  aliases: [ 'mc' ],
  enabled: true
};

exports.help = {
  name: 'minecraft',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'minecraft <MC_SERVER_IP>[:PORT]',
  example: [ 'minecraft 139.59.31.129', 'minecraft 139.59.31.129:25565' ]
};
