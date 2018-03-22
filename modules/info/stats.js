/**
 * @file stats command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let owners = [];
    for (let userID of Bastion.credentials.ownerId) {
      let user = await Bastion.fetchUser(userID).catch(() => {});
      owners.push(user.tag);
    }

    let shardStats = Bastion.shard ? await Bastion.shard.broadcastEval('this.uptime') : 'None';
    if (shardStats instanceof Array) {
      shardStats = shardStats.length === Bastion.shard.count ? 'All shards online' : `Launched ${shardStats.length} / ${Bastion.shard.count} shards`;
    }

    let uptime = Bastion.shard ? await Bastion.shard.broadcastEval('this.uptime') : Bastion.uptime;
    if (uptime instanceof Array) {
      uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
    }
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

    let guilds = Bastion.shard ? await Bastion.shard.broadcastEval('this.guilds.size') : Bastion.guilds.size;
    if (guilds instanceof Array) {
      guilds = guilds.reduce((sum, val) => sum + val, 0);
    }
    let textChannels = Bastion.shard ? await Bastion.shard.broadcastEval('this.channels.filter(channel => channel.type === \'text\').size') : Bastion.channels.filter(channel => channel.type === 'text').size;
    if (textChannels instanceof Array) {
      textChannels = textChannels.reduce((sum, val) => sum + val, 0);
    }
    let voiceChannels = Bastion.shard ? await Bastion.shard.broadcastEval('this.channels.filter(channel => channel.type === \'voice\').size') : Bastion.channels.filter(channel => channel.type === 'voice').size;
    if (voiceChannels instanceof Array) {
      voiceChannels = voiceChannels.reduce((sum, val) => sum + val, 0);
    }
    let rss = Bastion.shard ? await Bastion.shard.broadcastEval('process.memoryUsage().rss') : process.memoryUsage().rss;
    if (rss instanceof Array) {
      rss = rss.reduce((sum, val) => sum + val, 0);
    }
    let heapUsed = Bastion.shard ? await Bastion.shard.broadcastEval('process.memoryUsage().heapUsed') : process.memoryUsage().heapUsed;
    if (heapUsed instanceof Array) {
      heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: `Bastion ${Bastion.package.version}`
        },
        url: Bastion.package.url,
        fields: [
          {
            name: 'Author',
            value: `[${Bastion.package.author}](${Bastion.package.authorUrl})`,
            inline: true
          },
          {
            name: 'BOT ID',
            value: Bastion.credentials.botId,
            inline: true
          },
          {
            name: `Owner${Bastion.credentials.ownerId.length > 1 ? 's' : ''}`,
            value: owners.join('\n'),
            inline: true
          },
          {
            name: `Owner ID${Bastion.credentials.ownerId.length > 1 ? 's' : ''}`,
            value: Bastion.credentials.ownerId.join('\n'),
            inline: true
          },
          {
            name: 'Default Prefix',
            value: Bastion.config.prefix,
            inline: true
          },
          {
            name: 'Uptime',
            value: uptime,
            inline: true
          },
          {
            name: 'Shards',
            value: Bastion.shard ? `${Bastion.shard.count} Shards` : 'None',
            inline: true
          },
          {
            name: 'Shard Status',
            value: shardStats,
            inline: true
          },
          {
            name: 'Presence',
            value: `${guilds.toHumanString()} Servers\n`
            + `${textChannels.toHumanString()} Text Channels\n`
            + `${voiceChannels.toHumanString()} Voice Channels`,
            inline: true
          },
          {
            name: 'Memory',
            value: `${(rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                   + `${(heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
            inline: true
          }
        ],
        thumbnail: {
          url: Bastion.user.displayAvatarURL
        },
        footer: {
          text: `${Bastion.shard ? `Shard: ${Bastion.shard.id} • ` : ''}WebSocket PING: ${parseInt(Bastion.ping)}ms`
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
  aliases: [ 'info' ],
  enabled: true
};

exports.help = {
  name: 'stats',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stats',
  example: []
};
