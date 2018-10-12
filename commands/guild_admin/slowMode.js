/**
 * @file slowMode command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
      slowModeStats = Bastion.i18n.info(message.guild.language, 'disableSlowMode', message.author.tag);
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
      slowModeStats = Bastion.i18n.info(message.guild.language, 'enableSlowMode', message.author.tag);
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
  description: 'Enables slow mode in the server. Users are notified when they send messages too quickly. And if users get too spammy, they are temporarily text muted in the channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'slowMode',
  example: []
};
