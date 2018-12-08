/**
 * @file uncoverSneakyLinks command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildModels = await message.client.database.models.guild.findOne({
    attributes: [ 'uncoverSneakyLinks' ],
    where: {
      guildID: message.guild.id
    }
  });

  let sneakyLinkWarningsStatus = !guildModels.dataValues.uncoverSneakyLinks;

  await message.client.database.models.guild.update({
    uncoverSneakyLinks: sneakyLinkWarningsStatus
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'uncoverSneakyLinks' ]
  });

  await message.channel.send({
    embed: {
      color: sneakyLinkWarningsStatus ? Bastion.colors.GREEN : Bastion.colors.RED,
      description: Bastion.i18n.info(message.guild.language, sneakyLinkWarningsStatus ? 'enableSneakyLinkWarnings' : 'disableSneakyLinkWarnings', message.author.tag)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'uncoverLinks' ],
  enabled: true
};

exports.help = {
  name: 'uncoverSneakyLinks',
  description: 'Toggle uncovering of sneaky links in the messages sent in the server. If enabled, Bastion will show details of all link that contains redirects to other locations, in every message sent in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'uncoverSneakyLinks',
  example: []
};
