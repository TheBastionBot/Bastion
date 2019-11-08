/**
 * @file botRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'botRole' ],
    where: {
      guildID: message.guild.id
    }
  });

  await Bastion.database.models.guild.update({
    botRole: guildModel.dataValues.botRole ? null : message.channel.id
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'botRole' ]
  });

  await message.channel.send({
    embed: {
      color: guildModel.dataValues.botRole ? Bastion.colors.RED : Bastion.colors.GREEN,
      description: Bastion.i18n.info(message.guild.language, guildModel.dataValues.botRole ? 'unsetBotRole' : 'setBotRole', message.author.tag)
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
  name: 'botRole',
  description: 'Sets/unsets the Bot Role in the server. Any bot that joins the server is given this role.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'botRole',
  example: []
};
