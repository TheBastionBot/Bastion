/**
 * @file disableCommand command
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

  let command = args[0].toLowerCase();
  if (command === 'disablecommand' || command === 'disablecmd' || command === 'enablecommand' || command === 'enablecmd') {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('forbidden', 'errors'), string('commandNoDisable', 'errorMessage', command), message.channel);
  }

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
    return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'command'), message.channel);
  }

  if (!command.config.enabled) return;
  command.config.enabled = false;

  message.channel.send({
    embed: {
      color: Bastion.colors.red,
      description: `\`${command.help.name}\` command has been disabled until next restart. You can turn on this command using \`${Bastion.config.prefix}enableCommand ${command.help.name}\`.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablecmd' ],
  enabled: true
};

exports.help = {
  name: 'disablecommand',
  description: string('disableCommand', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'disableCommand <command_name>',
  example: [ 'disableCommand echo' ]
};
