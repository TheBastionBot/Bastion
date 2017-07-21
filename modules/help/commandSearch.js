/**
 * @file commandSearch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || args.join('').length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.join('').toLowerCase();
  let commands = Bastion.commands.map(c => c.help.name).filter(c => c.includes(args));
  if (commands.length === 0) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'command'), message.channel);
  }
  message.channel.send({
    embed: {
      color: Bastion.colors.yellow,
      title: 'Command Search',
      description: `Found ${commands.length} commands containing *${args}*.`,
      fields: [
        {
          name: 'Commands',
          value: `${message.guild.prefix}${commands.join(`\n${message.guild.prefix}`)}`
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'cmdsearch' ],
  enabled: true
};

exports.help = {
  name: 'commandsearch',
  description: string('commandSearch', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'commandSearch <text>',
  example: [ 'commandSearch user' ]
};
