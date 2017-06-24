/**
 * @file listTodo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo || todo.list === '[]') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', 'Not Found', `${message.author.username}, your todo list is empty.`, message.channel);
    }
    else {
      let list = JSON.parse(todo.list);
      list = list.map((l, i) => `**${i + 1}.**  ${l}`);

      let noOfPages = list.length / 10;
      let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
      i = i - 1;

      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          description: `${message.author.username}, here's your todo list.`,
          fields: [
            {
              name: 'Todo list',
              value: list.slice(i * 10, (i * 10) + 10).join('\n')
            }
          ],
          footer: {
            text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'todolist' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listtodo',
  description: 'Shows your todo list if you have one. It takes page number as an optional argument.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'listTodo [page_no]',
  example: [ 'listTodo', 'listTodo 2' ]
};
