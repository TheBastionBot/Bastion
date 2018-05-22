/**
 * @file filterInvite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'filterInvites' ],
      where: {
        guildID: message.guild.id
      }
    });

    let color, filterInviteStats;
    if (guildModel.dataValues.filterInvites) {
      await Bastion.database.models.guild.update({
        filterInvites: false
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterInvites' ]
      });
      color = Bastion.colors.RED;
      filterInviteStats = Bastion.i18n.info(message.guild.language, 'disableInviteFilter', message.author.tag);
    }
    else {
      await Bastion.database.models.guild.update({
        filterInvites: true
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterInvites' ]
      });
      color = Bastion.colors.GREEN;
      filterInviteStats = Bastion.i18n.info(message.guild.language, 'enableInviteFilter', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterInviteStats
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
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterInvite',
  description: 'Toggles automatic deleting of Discord server invites posted in the server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterInvite',
  example: []
};
