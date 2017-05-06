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
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!(index = parseInt(args[0])) || index <= 0) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  index -= 1;

  sql.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo) {
      message.channel.send({embed: {
        color: Bastion.colors.red,
        title: 'Todo list not found',
        description: `${message.author.username}, you haven't created a todo list.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let list = JSON.parse(todo.list);
      if (index >= list.length) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: 'That index was not found.'
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      let deletedItem = list[parseInt(args[0]) - 1];
      list.splice(parseInt(args[0]) - 1, 1);
      sql.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`).then(() => {
        message.channel.send({embed: {
          color: Bastion.colors.red,
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

exports.config = {
  aliases: ['deltodo'],
  enabled: true
};

exports.help = {
  name: 'deletetodo',
  description: 'Deletes an item from your todo list by it\'s index number.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'deleteTodo <index>',
  example: ['deleteTodo 3']
};
