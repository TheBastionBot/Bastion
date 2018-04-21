/**
 * @file slowMode command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'slowMode' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, slowModeStats;
    if (guildModel.dataValues.slowMode) {
      await Bastion.database.models.guild.update({
        slowMode: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'slowMode' ]
      });
      color = Bastion.colors.RED;
      slowModeStats = Bastion.strings.info(message.guild.language, 'disableSlowMode', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        slowMode: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'slowMode' ]
      });
      color = Bastion.colors.GREEN;
      slowModeStats = Bastion.strings.info(message.guild.language, 'enableSlowMode', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: slowModeStats
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
  name: 'slowMode',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'slowMode',
  example: []
};
