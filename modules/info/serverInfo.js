/**
 * @file serverInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
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
          value: message.guild.channels.filter(channel => channel.type === 'text').size,
          inline: true
        },
        {
          name: 'Voice Channels',
          value: message.guild.channels.filter(channel => channel.type === 'voice').size,
          inline: true
        },
        {
          name: 'Server Emojis',
          value: message.guild.emojis.size > 0 ? message.guild.emojis.size >= 25 ? `${message.guild.emojis.map(e => `<:${e.name}:${e.id}>`).splice(0, 25).join(' ')} and ${message.guild.emojis.size - 25} more.` : message.guild.emojis.map(e => `<:${e.name}:${e.id}>`).join(' ') : '-'
        }
      ],
      thumbnail: {
        url: message.guild.iconURL ? message.guild.iconURL : 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
      },
      image: {
        url: message.guild.splash ? message.guild.splashURL : null
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sinfo' ],
  enabled: true
};

exports.help = {
  name: 'serverInfo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverInfo',
  example: []
};
