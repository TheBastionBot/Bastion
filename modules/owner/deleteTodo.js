/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = function(Bastion, message, args) {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!(index = parseInt(args[0])) || index <= 0) return;
  index -= 1;

  sql.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo)
      message.channel.sendMessage('', {embed: {
        color: 13380644,
        title: 'Todo list not found',
        description: `${message.author.username}, you haven't created a todo list.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    else {
      let list = JSON.parse(todo.list);
      if (index >= list.length) return;
      let deletedItem = list[parseInt(args[0]) - 1];
      list.splice(parseInt(args[0]) - 1, 1);
      sql.run('INSERT OR REPLACE INTO todo (ownerID, list) VALUES (?, ?)', [message.author.id, JSON.stringify(list)]).then(() => {
        message.channel.sendMessage('', {embed: {
          color: 6651610,
          description: `${message.author.username}, I've deleted **${deletedItem}** from your todo list.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(() => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['deltodo']
};

exports.help = {
  name: 'deletetodo',
  description: 'Deletes an item from your todo list by it\'s index number.',
  permission: '',
  usage: 'deleteTodo <index>',
  example: ['deleteTodo 3']
};
