/**
 * @file listWhitelistDomains command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      attributes: [ 'whitelistedDomains' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.whitelistedDomains) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notSet', 'whitelisted domain'), message.channel);
    }

    let whitelistDomains = [ ...new Set(guildModel.dataValues.whitelistedDomains) ];

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
  description: 'Lists all whitelisted domains for the link filter.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'listWhitelistDomains [page_no]',
  example: [ 'listWhitelistDomains', 'listWhitelistDomains 2' ]
};
