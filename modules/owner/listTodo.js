/**
 * @file listTodo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let todo = await Bastion.db.get(`SELECT * FROM todo WHERE ownerID=${message.author.id}`);

    if (!todo || todo.list === '[]') {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'todoNotFound', true, message.author.username), message.channel);
    }

    let list = JSON.parse(todo.list);
    list = list.map((l, i) => `**${i + 1}.**  ${l}`);

    let noOfPages = list.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'todolist' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'listTodo',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listTodo [page_no]',
  example: [ 'listTodo', 'listTodo 2' ]
};
