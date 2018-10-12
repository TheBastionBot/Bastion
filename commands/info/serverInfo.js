/**
 * @file serverInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let nonAnimatedEmojis = message.guild.emojis.filter(emoji => !emoji.animated);
    let guildEmojis = nonAnimatedEmojis.size > 0 ? nonAnimatedEmojis.size > 25 ? `${nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).splice(0, 25).join(' ')} and ${nonAnimatedEmojis.size - 25} more.` : nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).join(' ') : '-';

    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'premium', 'description' ],
      where: {
        guildID: message.guild.id
      }
    });
    let guildDescription;
    if (guildModel && guildModel.dataValues.description) {
      guildDescription = await Bastion.methods.decodeString(guildModel.dataValues.description);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: message.guild.name
        },
        title: 'Server Info',
        description: guildDescription,
        fields: [
          {
            name: 'ID',
            value: message.guild.id,
            inline: true
          },
          {
            name: 'Premium',
            value: `[${guildModel && guildModel.dataValues.premium}](https://bastionbot.org 'Premium servers & perks are coming soon™')`.toUpperCase(),
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
            name: 'Members',
            value: `${message.guild.members.filter(m => !m.user.bot).size} Cached Users\n${message.guild.members.filter(m => m.user.bot).size} Cached BOTs`,
            inline: true
          },
          {
            name: 'Roles',
            value: message.guild.roles.size - 1,
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
            value: guildEmojis
          }
        ],
        thumbnail: {
          url: message.guild.icon ? message.guild.iconURL : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(message.guild.nameAcronym)}`
        },
        image: {
          url: message.guild.splash ? message.guild.splashURL : null
        }
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
  aliases: [ 'sinfo' ],
  enabled: true
};

exports.help = {
  name: 'serverInfo',
  description: 'Shows information of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverInfo',
  example: []
};
