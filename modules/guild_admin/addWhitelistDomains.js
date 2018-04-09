/**
 * @file addWhitelistDomains command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.domains || args.domains.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildSettings = await Bastion.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`);

    let whitelistDomains = JSON.parse(guildSettings.whitelistDomains);
    whitelistDomains = whitelistDomains.concat(args.domains);
    whitelistDomains = [ ...new Set(whitelistDomains) ];

    await Bastion.db.run(`UPDATE guildSettings SET whitelistDomains='${JSON.stringify(whitelistDomains)}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Added Domains to Whitelist',
        description: args.domains.join('\n')
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
    { name: 'domains', type: String, alias: 'd', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'addWhitelistDomains',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addWhitelistDomains [Domain] [anotherDomain] [someOtherDomain]',
  example: [ 'addWhitelistDomains https://bastionbot.org https://*.sankarsankampa.com' ]
};
