/**
 * @file addWhitelistDomains command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.domains || !args.domains.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'whitelistedDomains' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel.dataValues.whitelistedDomains) guildModel.dataValues.whitelistedDomains = [];

  let whitelistDomains = guildModel.dataValues.whitelistedDomains.concat(args.domains);
  whitelistDomains = [ ...new Set(whitelistDomains) ];

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
      color: Bastion.colors.GREEN,
      title: 'Added Domains to Whitelist',
      description: args.domains.join('\n')
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'domains', type: String, alias: 'd', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'addWhitelistDomains',
  description: 'Adds a domain to the whitelist for link filter.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addWhitelistDomains [Domain] [anotherDomain] [someOtherDomain]',
  example: [ 'addWhitelistDomains https://duckduckgo.com https://*.traction.one' ]
};
