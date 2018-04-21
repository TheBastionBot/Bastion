/**
 * @file filterLink command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'filterLinks' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, filterLinkStats;
    if (guildModel.dataValues.filterLinks) {
      await Bastion.database.models.guild.update({
        filterLinks: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterLinks' ]
      });
      color = Bastion.colors.RED;
      filterLinkStats = Bastion.strings.info(message.guild.language, 'disableLinkFilter', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        filterLinks: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterLinks' ]
      });
      color = Bastion.colors.GREEN;
      filterLinkStats = Bastion.strings.info(message.guild.language, 'enableLinkFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterLinkStats
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
  name: 'filterLink',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterLink',
  example: []
};
