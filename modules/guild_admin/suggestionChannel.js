/**
 * @file suggestionChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'suggestionChannel' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, suggestionChannelStats;
    if (guildModel.dataValues.suggestionChannel) {
      await Bastion.database.models.guild.update({
        suggestionChannel: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'suggestionChannel' ]
      });
      color = Bastion.colors.RED;
      suggestionChannelStats = Bastion.strings.info(message.guild.language, 'disableSuggestionChannel', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        suggestionChannel: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'suggestionChannel' ]
      });
      color = Bastion.colors.GREEN;
      suggestionChannelStats = Bastion.strings.info(message.guild.language, 'enableSuggestionChannel', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: suggestionChannelStats
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
  name: 'suggestionChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'suggestionChannel',
  example: []
};
