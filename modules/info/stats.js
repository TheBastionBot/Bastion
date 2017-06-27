/**
 * @file stats command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
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
      color: Bastion.colors.dark_grey,
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
          name: 'Library',
          value: Bastion.package.library,
          inline: true
        },
        {
          name: 'BOT ID',
          value: Bastion.credentials.botId,
          inline: true
        },
        {
          name: 'Prefix',
          value: Bastion.config.prefix,
          inline: true
        },
        {
          name: 'Owner',
          value: Bastion.users.get(Bastion.credentials.ownerId[0]).tag,
          inline: true
        },
        {
          name: `Owner ID${Bastion.credentials.ownerId.length > 1 ? 's' : ''}`,
          value: Bastion.credentials.ownerId.join('\n'),
          inline: true
        },
        {
          name: 'Presence',
          value: `${Bastion.guilds.size} Servers\n${Bastion.channels.filter(channel => channel.type === 'text').size} Text Channels\n${Bastion.channels.filter(channel => channel.type === 'voice').size} Voice Channels`,
          inline: true
        },
        {
          name: 'Uptime',
          value: uptime,
          inline: true
        },
        {
          name: 'Heap',
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          inline: true
        },
        {
          name: 'Memory',
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          inline: true
        }
      ],
      thumbnail: {
        url: Bastion.user.displayAvatarURL
      },
      footer: {
        text: `Ping: ${parseInt(Bastion.ping)}ms`
      },
      timestamp: new Date()
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'info' ],
  enabled: true
};

exports.help = {
  name: 'stats',
  description: string('stats', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'stats',
  example: []
};
