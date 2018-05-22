/**
 * @file announcementChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let description, color;

    if (args.remove) {
      await Bastion.database.models.guild.update({
        announcementChannel: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'announcementChannel' ]
      });
      description = Bastion.i18n.info(message.guild.language, 'disableAnnouncementChannel', message.author.tag);
      color = Bastion.colors.RED;
    }
    else {
      await Bastion.database.models.guild.update({
        announcementChannel: message.channel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'announcementChannel' ]
      });
      description = Bastion.i18n.info(message.guild.language, 'enableAnnouncementChannel', message.author.tag);
      color = Bastion.colors.GREEN;
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
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
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'announcementChannel',
  description: 'Adds/removes an announcement channel. You will receive announcements made by the bot owner in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'announcementChannel [--remove]',
  example: [ 'announcementChannel', 'announcementChannel --remove' ]
};
