/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const toHRTime = require('pretty-ms');

exports.run = (Bastion, message, args) => {
  message.channel.sendMessage('', {embed: {
    color: Bastion.colors.dark_grey,
    author: {
      name: `Bastion ${Bastion.package.version}`,
      icon_url: Bastion.user.displayAvatarURL
    },
    url: Bastion.package.url,
    fields: [
      {
        name: 'Author',
        value: Bastion.package.author,
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
        value: `${Bastion.users.get(Bastion.credentials.ownerId[0]).username}#${Bastion.users.get(Bastion.credentials.ownerId[0]).discriminator}`,
        inline: true
      },
      {
        name: 'Owner ID(s)',
        value: Bastion.credentials.ownerId.join('\n'),
        inline: true
      },
      {
        name: 'Presence',
        value: `${Bastion.guilds.size} Servers\n${Bastion.channels.filter(channel=> channel.type === 'text').size} Text Channels\n${Bastion.channels.filter(channel=> channel.type === 'voice').size} Voice Channels`,
        inline: true
      },
      {
        name: 'Uptime',
        value: toHRTime(Bastion.uptime),
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
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['info']
};

exports.help = {
  name: 'stats',
  description: 'Display stats & info about the bot.',
  permission: '',
  usage: 'stats',
  example: []
};
