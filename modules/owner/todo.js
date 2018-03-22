/**
 * @file todo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let todo = await Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`);

    if (!todo) {
      await Bastion.db.run('INSERT OR IGNORE INTO todo (ownerID, list) VALUES (?, ?)', [ message.author.id, `["${args.join(' ')}"]` ]);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Todo list created',
          description: `${message.author.username}, I've created your todo list and added **${args.join(' ')}** to it.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let list = JSON.parse(todo.list);
      list.push(args.join(' '));

      await Bastion.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Todo list updated',
          description: `${message.author.username}, I've added **${args.join(' ')}** to your todo list.`
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
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'todo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'todo <text>',
  example: [ 'todo Reconfigure my firewall' ]
};
