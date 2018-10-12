/**
 * @file reportChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'reportChannel' ],
      where: {
        guildID: message.guild.id
      }
    });

    await Bastion.database.models.guild.update({
      reportChannel: guildModel.dataValues.reportChannel ? null : message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'reportChannel' ]
    });

    message.channel.send({
      embed: {
        color: guildModel.dataValues.reportChannel ? Bastion.colors.RED : Bastion.colors.GREEN,
        description: Bastion.i18n.info(message.guild.language, guildModel.dataValues.reportChannel ? 'disableReportChannel' : 'enableReportChannel', message.author.tag)
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
  name: 'reportChannel',
  description: 'Adds/removes the channel as the report channel. If it\'s enabled, when users report server members using the `report` command, the reports will be posted in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'reportChannel',
  example: []
};
