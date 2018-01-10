/**
 * @file setLanguage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name && !args.list) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (args.list) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Available Languages',
          description: Bastion.strings.availableLanguages.join(', ').toUpperCase()
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    args.name = args.name.toLowerCase();
    if (args.name) {
      if (!Bastion.strings.availableLanguages.includes(args.name)) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'notFound', true, 'Language Code'), message.channel);
      }

      await Bastion.db.run(`UPDATE guildSettings SET language='${args.name}' WHERE guildID=${message.guild.id}`);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Language for this server is now set to: \`${args.name.toUpperCase()}\``
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'list', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'setLanguage',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'setLanguage < Language Code | --list>',
  example: [ 'setLanguage es' ]
};
