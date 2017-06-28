/**
 * @file setPrefix command
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

  if (!args.prefix && !args.default) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let prefix, prefixMaxLength = 8;
  if (args.default) {
    prefix = Bastion.config.prefix;
  }
  else {
    prefix = args.prefix.join(' ');
    if (prefix.length > prefixMaxLength) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('invalidInput', 'errors'), string('outOfRange', 'errorMessage', 'Prefix', 1, prefixMaxLength), message.channel);
    }
  }


  Bastion.db.run(`UPDATE guildSettings SET prefix='${prefix}' WHERE guildID=${message.guild.id}`).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: `Prefix for your server is now set to: \`${prefix}\``
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'prefix', type: String, alias: 'p', multiple: true, defaultOption: true },
    { name: 'default', type: Boolean, alias: 'd' }
  ]
};

exports.help = {
  name: 'setprefix',
  description: string('setPrefix', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'setPrefix < prefix | --default >',
  example: [ 'setPrefix !', 'setPrefix --default' ]
};
