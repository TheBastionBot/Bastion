/**
 * @file removeFilteredWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No self assignable roles found.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let filteredWords = JSON.parse(row.filteredWords);

      if (index >= filteredWords.length) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: 'That index was not found.'
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
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
  description: 'Deletes a word from the list of filtered words it\'s index number.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'removeFilteredWord <index>',
  example: [ 'removeFilteredWord 3' ]
};
