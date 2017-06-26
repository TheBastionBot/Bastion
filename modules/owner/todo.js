/**
 * @file todo command
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

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`).then(todo => {
    if (!todo) {
      Bastion.db.run('INSERT OR IGNORE INTO todo (ownerID, list) VALUES (?, ?)', [ message.author.id, `["${args.join(' ')}"]` ]).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.green,
            title: 'Todo list created',
            description: `${message.author.username}, I've created your todo list and added **${args.join(' ')}** to it.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      let list = JSON.parse(todo.list);
      list.push(args.join(' '));
      Bastion.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`).then(() => {
        message.channel.send({
          embed: {
            color: Bastion.colors.green,
            title: 'Todo list updated',
            description: `${message.author.username}, I've added **${args.join(' ')}** to your todo list.`
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'todo',
  description: string('todo', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'todo <text>',
  example: [ 'todo Reconfigure my firewall' ]
};
