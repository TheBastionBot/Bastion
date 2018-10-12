/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, logStats;
    if (guildModel.dataValues.serverLog) {
      await Bastion.database.models.guild.update({
        serverLog: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'serverLog' ]
      });
      color = Bastion.colors.RED;
      logStats = Bastion.i18n.info(message.guild.language, 'disableServerLog', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        serverLog: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'serverLog' ]
      });
      color = Bastion.colors.GREEN;
      logStats = Bastion.i18n.info(message.guild.language, 'enableServerLog', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: logStats
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
  name: 'log',
  description: 'Toggles logging of various events in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'log',
  example: []
};
