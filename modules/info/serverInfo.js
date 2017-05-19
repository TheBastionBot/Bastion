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

exports.run = (Bastion, message) => {
  message.channel.send({embed: {
    color: Bastion.colors.blue,
    title: 'Server Info',
    fields: [
      {
        name: 'Name',
        value: message.guild.name,
        inline: true
      },
      {
        name: 'ID',
        value: message.guild.id,
        inline: true
      },
      {
        name: 'Owner',
        value: message.guild.owner.user.tag,
        inline: true
      },
      {
        name: 'Owner ID',
        value: message.guild.ownerID,
        inline: true
      },
      {
        name: 'Created At',
        value: message.guild.createdAt.toUTCString(),
        inline: true
      },
      {
        name: 'Region',
        value: message.guild.region.toUpperCase(),
        inline: true
      },
      {
        name: 'Roles',
        value: message.guild.roles.size - 1,
        inline: true
      },
      {
        name: 'Members',
        value: `${message.guild.members.filter(m => !m.user.bot).size} Users\n${message.guild.members.filter(m => m.user.bot).size} BOTs`,
        inline: true
      },
      {
        name: 'Text Channels',
        value: message.guild.channels.filter(channel => channel.type === "text").size,
        inline: true
      },
      {
        name: 'Voice Channels',
        value: message.guild.channels.filter(channel => channel.type === "voice").size,
        inline: true
      },
      {
        name: 'Server Emojis',
        value: message.guild.emojis.size > 0 ? message.guild.emojis.size >= 30 ? message.guild.emojis.map(e => `<:${e.name}:${e.id}>`).splice(0, 30).join(' ') + `and ${message.guild.emojis.size - 30} more.` : message.guild.emojis.map(e => `<:${e.name}:${e.id}>`).join(' ') : '-'
      }
    ],
    thumbnail: {
      url: message.guild.iconURL ? message.guild.iconURL : 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
    },
    image: {
      url: message.guild.splash ? message.guild.splashURL : null
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['sinfo'],
  enabled: true
};

exports.help = {
  name: 'serverinfo',
  description: 'Shows the server\'s information the command was invoked in.',
  botPermission: '',
  userPermission: '',
  usage: 'serverInfo',
  example: []
};
