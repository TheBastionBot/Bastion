/**
 * @file filterWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'filterWords' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, filterWordStats;
    if (guildModel.dataValues.filterWords) {
      await Bastion.database.models.guild.update({
        filterWords: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterWords' ]
      });
      color = Bastion.colors.RED;
      filterWordStats = Bastion.strings.info(message.guild.language, 'disableWordFilter', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        filterWords: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterWords' ]
      });
      color = Bastion.colors.GREEN;
      filterWordStats = Bastion.strings.info(message.guild.language, 'enableWordFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterWordStats
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
  name: 'filterWord',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterWord',
  example: []
};
