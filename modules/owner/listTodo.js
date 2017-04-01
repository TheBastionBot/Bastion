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

exports.run = (Bastion, message, args) => {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');

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
      list = list.map((l, i) => `**${i+1}.**  ${l}`);
      let i = 0;
      if (isNaN(args = parseInt(args[0]))) i = 1;
      else i = args < list.length/10+1 ? args : 1;
      i = i - 1;
      message.channel.sendMessage('', {embed: {
        color: 6651610,
        description: `${message.author.username}, here's your todo list.`,
        fields: [
          {
            name: 'Todo list',
            value: list.slice(i*10, (i*10)+10).join('\n')
          }
        ],
        footer: {
          text: `Page: ${i+1} of ${parseInt(list.length/10+1)}`
        }
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(() => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['todolist']
};

exports.help = {
  name: 'listtodo',
  description: 'Shows your todo list if you have one. It takes page number as an optional argument.',
  permission: '',
  usage: 'listTodo [page_no]',
  example: ['listTodo', 'listTodo 2']
};
