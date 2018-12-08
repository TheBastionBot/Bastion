/**
 * @file reactionAnnouncements command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'reactionAnnouncements' ],
    where: {
      guildID: message.guild.id
    }
  });

  await Bastion.database.models.guild.update({
    reactionAnnouncements: !guildModel.dataValues.reactionAnnouncements
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'reactionAnnouncements' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors[guildModel.dataValues.reactionAnnouncements ? 'RED' : 'GREEN'],
      description: Bastion.i18n.info(message.guild.language, guildModel.dataValues.reactionAnnouncements ? 'disableReactionAnnouncements' : 'enableReactionAnnouncements', message.author.tag)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'reactionAnnouncements',
  description: 'Toggles Reaction Announcements in the server. Adding either 📣 or 📢 reaction to a message will send the message to the announcement channel, provided an announcement channel has been set.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'reactionAnnouncements',
  example: []
};
