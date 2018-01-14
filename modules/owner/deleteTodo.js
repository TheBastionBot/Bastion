/**
 * @file deleteTodo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let index = parseInt(args[0]);
    if (!index || index <= 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }
    index -= 1;

    let todo = await Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`);

    if (!todo) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'todoNotFound', true, message.author.username), message.channel);
    }
    else {
      let list = JSON.parse(todo.list);

      if (index >= list.length) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'indexRange', true), message.channel);
      }

      let deletedItem = list[parseInt(args[0]) - 1];
      list.splice(parseInt(args[0]) - 1, 1);

      await Bastion.db.run(`UPDATE todo SET list='${JSON.stringify(list)}' WHERE ownerID=${message.author.id}`);

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `${message.author.username}, I've deleted **${deletedItem}** from your todo list.`
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
  aliases: [ 'deltodo' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'deleteTodo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'deleteTodo <index>',
  example: [ 'deleteTodo 3' ]
};
