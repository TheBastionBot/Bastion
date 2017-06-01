/**
 * @file listTodo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  sql.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo || todo.list === '[]') {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          title: 'Todo list not found',
          description: `${message.author.username}, you haven't created a todo list.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let list = JSON.parse(todo.list);
      list = list.map((l, i) => `**${i + 1}.**  ${l}`);
      let i = 0;
      if (isNaN(args = parseInt(args[0]))) {
        i = 1;
      }
      else {
        i = (args > 0 && args < list.length / 10 + 1) ? args : 1;
      }
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
            text: `Page: ${i + 1} of ${parseInt(list.length / 10 + 1)}`
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
  enabled: true
};

exports.help = {
  name: 'listtodo',
  description: 'Shows your todo list if you have one. It takes page number as an optional argument.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'listTodo [page_no]',
  example: [ 'listTodo', 'listTodo 2' ]
};
