/**
 * @file removeWhitelistDomain command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }
  index -= 1;

  let guildSettings = await Bastion.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  if (!guildSettings || guildSettings.whitelistDomains === '[]') {
    /**
    * Error condition is encountered.
    * @fires error
    */
    Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notSet', true, 'whitelist domain'), message.channel);
  }
  else {
    let whitelistDomains = JSON.parse(guildSettings.whitelistDomains);

    if (index >= whitelistDomains.length) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'indexRange', true), message.channel);
    }

    let removedDomain = whitelistDomains[parseInt(args[0]) - 1];
    whitelistDomains.splice(parseInt(args[0]) - 1, 1);

    await Bastion.db.run(`UPDATE guildSettings SET whitelistDomains='${JSON.stringify(whitelistDomains)}' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
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
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeWhitelistDomain <index>',
  example: [ 'removeWhitelistDomain 3' ]
};
