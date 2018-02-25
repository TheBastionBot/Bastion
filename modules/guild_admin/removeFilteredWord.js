/**
 * @file removeFilteredWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let index = parseInt(args[0]);
    if (!index || index <= 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    index -= 1;

    let guildSettings = await Bastion.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (!guildSettings || !guildSettings.filteredWords) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notSet', true, 'filtered words'), message.channel);
    }
    else {
      let filteredWords = guildSettings.filteredWords.split(' ');

      if (index >= filteredWords.length) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'indexRange', true), message.channel);
      }

      let removedFilteredWord = filteredWords[parseInt(args[0]) - 1];
      filteredWords.splice(parseInt(args[0]) - 1, 1);

      await Bastion.db.run(`UPDATE guildSettings SET filteredWords='${filteredWords.join(' ')}' WHERE guildID=${message.guild.id}`);

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `I've deleted **${removedFilteredWord}** from filtered words.`
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
  aliases: [ 'removefw' ],
  enabled: true
};

exports.help = {
  name: 'removeFilteredWord',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeFilteredWord <index>',
  example: [ 'removeFilteredWord 3' ]
};
