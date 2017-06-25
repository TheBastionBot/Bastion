/**
 * @file removeFilteredWord command
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

  Bastion.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.filteredWords === '[]') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', 'Not Found', 'No words are being filterd.', message.channel);
    }
    else {
      let filteredWords = JSON.parse(row.filteredWords);

      if (index >= filteredWords.length) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', 'Not Found', 'That index was not found.', message.channel);
      }

      let removedFilteredWord = filteredWords[parseInt(args[0]) - 1];
      filteredWords.splice(parseInt(args[0]) - 1, 1);

      Bastion.db.run(`UPDATE guildSettings SET filteredWords='${JSON.stringify(filteredWords)}' WHERE guildID=${message.guild.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `I've deleted **${removedFilteredWord}** from filtered words.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'removefw' ],
  enabled: true
};

exports.help = {
  name: 'removefilteredword',
  description: string('removeFilteredWord', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeFilteredWord <index>',
  example: [ 'removeFilteredWord 3' ]
};
