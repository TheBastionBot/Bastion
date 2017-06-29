/**
 * @file deleteTodo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
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

  Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', string('notFound', 'errors'), string('todoNotFound', 'errorMessage', message.author.username), message.channel);
    }
    else {
      let list = JSON.parse(todo.list);
      if (index >= list.length) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('notFound', 'errors'), string('indexRange', 'errorMessage'), message.channel);
      }
      let deletedItem = list[parseInt(args[0]) - 1];
      list.splice(parseInt(args[0]) - 1, 1);
      Bastion.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `${message.author.username}, I've deleted **${deletedItem}** from your todo list.`
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
  aliases: [ 'deltodo' ],
  enabled: true
};

exports.help = {
  name: 'deletetodo',
  description: string('deleteTodo', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'deleteTodo <index>',
  example: [ 'deleteTodo 3' ]
};
