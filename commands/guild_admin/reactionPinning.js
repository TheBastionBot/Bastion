/**
 * @file reactionPinning command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'reactionPinning' ],
      where: {
        guildID: message.guild.id
      }
    });

    await Bastion.database.models.guild.update({
      reactionPinning: !guildModel.dataValues.reactionPinning
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'reactionPinning' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors[guildModel.dataValues.reactionPinning ? 'RED' : 'GREEN'],
        description: Bastion.i18n.info(message.guild.language, guildModel.dataValues.reactionPinning ? 'disableReactionPinning' : 'enableReactionPinning', message.author.tag)
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
  name: 'reactionPinning',
  description: 'Toggles Reaction Pinning in the server. If Reaction Pinning is enabled, adding either 📌 or 📍 reaction to a message will pin the message to the channel and removing the reactions will unpin it too.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'reactionPinning',
  example: []
};
