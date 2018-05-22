/**
 * @file starboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'starboard' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, starboardStats;
    if (guildModel.dataValues.starboard) {
      await Bastion.database.models.guild.update({
        starboard: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'starboard' ]
      });
      color = Bastion.colors.RED;
      starboardStats = Bastion.i18n.info(message.guild.language, 'disableStarboard', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        starboard: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'starboard' ]
      });
      color = Bastion.colors.GREEN;
      starboardStats = Bastion.i18n.info(message.guild.language, 'enableStarboard', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: starboardStats
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'starboard',
  description: 'Toggles logging of starred messages of the server in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'starboard',
  example: []
};
