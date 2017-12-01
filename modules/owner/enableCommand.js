/**
 * @file enableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let command = args.name.toLowerCase();
  if (Bastion.commands.has(command) || Bastion.aliases.has(command)) {
    if (Bastion.commands.has(command)) {
      command = Bastion.commands.get(command);
    }
    else if (Bastion.aliases.has(command)) {
      command = Bastion.commands.get(Bastion.aliases.get(command));
    }
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'command'), message.channel);
  }

  if (command.config.enabled) return;
  command.config.enabled = true;

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: `\`${command.help.name}\` command has been enabled.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'enableCommand',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'enableCommand <command_name>',
  example: [ 'enableCommand echo' ]
};
