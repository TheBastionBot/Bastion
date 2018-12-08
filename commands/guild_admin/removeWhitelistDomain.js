/**
 * @file removeWhitelistDomain command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    return Bastion.emit('commandUsage', message, this.help);
  }
  index -= 1;

  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'whitelistedDomains' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.whitelistedDomains) {
    Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notSet', 'whitelist domain'), message.channel);
  }
  else {
    let whitelistDomains = guildModel.dataValues.whitelistedDomains;

    if (index >= whitelistDomains.length) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'indexRange'), message.channel);
    }

    let removedDomain = whitelistDomains[parseInt(args[0]) - 1];
    whitelistDomains.splice(parseInt(args[0]) - 1, 1);

    await Bastion.database.models.guild.update({
      whitelistedDomains: whitelistDomains
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'whitelistedDomains' ]
    });

    await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: `I've deleted **${removedDomain}** from whitelisted domains.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'removeWhitelistDomain',
  description: 'Deletes a domain from the list of whitelisted domains.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeWhitelistDomain <index>',
  example: [ 'removeWhitelistDomain 3' ]
};
