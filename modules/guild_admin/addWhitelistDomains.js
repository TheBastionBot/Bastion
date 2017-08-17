/**
 * @file addWhitelistDomains command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.domains || args.domains.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let guildSettings = await Bastion.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let whitelistDomains = JSON.parse(guildSettings.whitelistDomains);
  whitelistDomains = whitelistDomains.concat(args.domains);
  whitelistDomains = [ ...new Set(whitelistDomains) ];

  await Bastion.db.run(`UPDATE guildSettings SET whitelistDomains='${JSON.stringify(whitelistDomains)}' WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  message.channel.send({
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
  name: 'addwhitelistdomains',
  description: string('addWhitelistDomains', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'addWhitelistDomains [Domain] [anotherDomain] [someOtherDomain]',
  example: [ 'addWhitelistDomains https://BastionBot.org https://*.sankarsankampa.com' ]
};
