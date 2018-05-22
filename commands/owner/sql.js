/**
 * @file sql command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.query) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let startTime = new Date();
    let result = await Bastion.database.query(args.query.join(' '));
    let endTime = new Date();

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'SQL query successfully executed.',
        fields: [
          {
            name: 'SQL Query',
            value: `\`\`\`sql\n${result[1].sql}\`\`\``
          },
          {
            name: 'Execution Time',
            value: `${endTime - startTime}ms`
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 'SQLITE_ERROR') {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', 'SQLite Error', `\`\`\`${e.stack}\`\`\``, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'query', type: String, multiple: true, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'sql',
  description: 'Execute SQL query on %bastion%\'s database.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sql <SQL Query>',
  example: [ 'sql ' ]
};
