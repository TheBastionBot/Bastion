/**
 * @file setPrefix command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.prefix && !args.default) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let prefix, maxPrefix = 5, prefixMaxLength = 8;
    if (args.default) {
      prefix = Bastion.config.prefix;
    }
    else {
      if (args.prefix.length > maxPrefix) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), `You can only add a maximum of ${maxPrefix} prefixes.`, message.channel);
      }
      prefix = args.prefix.join(' ');
      if (args.prefix.some(prefix => prefix.length > prefixMaxLength)) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'prefixRange', true, prefixMaxLength), message.channel);
      }
    }


    await Bastion.db.run(`UPDATE guildSettings SET prefix='${prefix}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'setPrefix', message.author.tag, prefix)
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
    { name: 'prefix', type: String, alias: 'p', multiple: true, defaultOption: true },
    { name: 'default', type: Boolean, alias: 'd' }
  ]
};

exports.help = {
  name: 'setPrefix',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'setPrefix < prefix | --default >',
  example: [ 'setPrefix !', 'setPrefix --default' ]
};
