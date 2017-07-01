/**
 * @file removeWhitelistDomain command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
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

  Bastion.db.get(`SELECT whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (!guild || guild.whitelistDomains === '[]') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', string('notFound', 'errors'), string('notSet', 'errorMessage', 'whitelist domains'), message.channel);
    }
    else {
      let whitelistDomains = JSON.parse(guild.whitelistDomains);

      if (index >= whitelistDomains.length) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('notFound', 'errors'), string('indexRange', 'errorMessage'), message.channel);
      }

      let removedDomain = whitelistDomains[parseInt(args[0]) - 1];
      whitelistDomains.splice(parseInt(args[0]) - 1, 1);

      Bastion.db.run(`UPDATE guildSettings SET whitelistDomains='${JSON.stringify(whitelistDomains)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I've deleted **${removedDomain}** from whitelisted domains.`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }).catch(e => {
        Bastion.log.error(e);
      });
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
  name: 'removewhitelistdomain',
  description: string('removeWhitelistDomain', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeWhitelistDomain <index>',
  example: [ 'removeWhitelistDomain 3' ]
};
