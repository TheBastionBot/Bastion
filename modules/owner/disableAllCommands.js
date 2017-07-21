/**
 * @file disableAllCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let forbiddenCommands = [
    'disableallcommands',
    'disablecommand',
    'disablemodule',
    'enableallcommands',
    'enablecommand',
    'enablemodule'
  ];

  Bastion.commands.filter(cmd => {
    (!forbiddenCommands.includes(cmd.help.name)) ? cmd.config.enabled = false : cmd.config.enabled = true;
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.red,
      description: 'All commands have been disabled until next restart. You can enable all commands using `enableAllCommands`. Or you can enable any specific module or command using `enableModule <module_name>` or `enableCommand <command_name>` respectively.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disableallmodules', 'disableallcmds', 'disableallmdls' ],
  enabled: true
};

exports.help = {
  name: 'disableallcommands',
  description: string('disableAllCommands', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'disableAllCommands',
  example: []
};
