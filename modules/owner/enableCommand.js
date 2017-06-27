/**
 * @file enableCommand command
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
    return Bastion.emit('error', string('notFound', 'errors'), `\`${command}\` command was not found.`, message.channel);
  }

  if (command.config.enabled) return;
  command.config.enabled = true;

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      description: `\`${command.help.name}\` command has been enabled.`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true
};

exports.help = {
  name: 'enablecommand',
  description: string('enableCommand', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'enableCommand <command_name>',
  example: [ 'enableCommand echo' ]
};
