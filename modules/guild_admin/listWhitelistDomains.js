/**
 * @file listWhitelistDomains command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  try {
    if (!message.member.hasPermission(this.help.userTextPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
    }

    let guildSettings = await Bastion.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || guildSettings.whitelistDomains === '[]') {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notSet', true, 'whitelisted domain'), message.channel);
    }

    let whitelistDomains = JSON.parse(guildSettings.whitelistDomains);
    whitelistDomains = [ ...new Set(whitelistDomains) ];

    whitelistDomains = whitelistDomains.map((r, i) => `${i + 1}. ${r}`);

    let noOfPages = whitelistDomains.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Whitelisted Domains',
        description: whitelistDomains.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
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
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listWhitelistDomains',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  usage: 'listWhitelistDomains [page_no]',
  example: [ 'listWhitelistDomains', 'listWhitelistDomains 2' ]
};
