/**
 * @file commandSearch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
    return Bastion.emit('error', 'Not Found', `No command was found for *${args}*.`, message.channel);
  }
  message.channel.send({
    embed: {
      color: Bastion.colors.yellow,
      title: 'Command Search',
      description: `Found ${commands.length} commands containing *${args}*.`,
      fields: [
        {
          name: 'Commands',
          value: `${Bastion.config.prefix}${commands.join(`\n${Bastion.config.prefix}`)}`
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'cmdsearch' ],
  enabled: true
};

exports.help = {
  name: 'commandsearch',
  description: 'Search for a Bastion\'s command with a given text.',
  botPermission: '',
  userPermission: '',
  usage: 'commandSearch <text>',
  example: [ 'commandSearch user' ]
};
