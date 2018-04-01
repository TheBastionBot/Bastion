/**
 * @file shardStats command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  try {
    if (!Bastion.shard) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidUse'), 'Bastion is not sharded. Run Bastion using the sharding manager.', message.channel);
    }

    let uptime = Bastion.uptime;
    let seconds = uptime / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    uptime = `${seconds}s`;
    if (days) {
      uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    else if (hours) {
      uptime = `${hours}h ${minutes}m ${seconds}s`;
    }
    else if (minutes) {
      uptime = `${minutes}m ${seconds}s`;
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Shard Stats',
        url: Bastion.package.url,
        fields: [
          {
            name: 'Shard ID',
            value: Bastion.shard.id,
            inline: true
          },
          {
            name: 'Uptime',
            value: uptime,
            inline: true
          },
          {
            name: 'WebSocket PING',
            value: `${Bastion.ping.toFixed(2)}ms`,
            inline: true
          },
          {
            name: 'Presence',
            value: `${Bastion.guilds.size.toHumanString()} Servers\n`
            + `${Bastion.channels.filter(channel => channel.type === 'text').size.toHumanString()} Text Channels\n`
            + `${Bastion.channels.filter(channel => channel.type === 'voice').size.toHumanString()} Voice Channels`,
            inline: true
          },
          {
            name: 'Memory',
            value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                   + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
            inline: true
          }
        ],
        footer: {
          text: `Total Shards: ${Bastion.shard.count}`
        },
        timestamp: new Date()
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'shard' ],
  enabled: true
};

exports.help = {
  name: 'shardStats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shardStats',
  example: []
};
