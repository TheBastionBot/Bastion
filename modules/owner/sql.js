/**
 * @file sql command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  try {
    if (!Bastion.credentials.ownerId.includes(message.author.id)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userPermission);
    }

    if (!args.query) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let startTime = new Date();
    let result = await Bastion.db.run(args.query.join(' '));
    let endTime = new Date();

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'SQL query successfully executed.',
        fields: [
          {
            name: 'SQL Query',
            value: `\`\`\`sql\n${result.stmt.sql}\`\`\``
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
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'sqliteError'), `\`\`\`${e.stack}\`\`\``, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'query', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'sql',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'sql <SQL Query>',
  example: [ 'sql ' ]
};
