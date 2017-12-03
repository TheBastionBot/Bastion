/**
 * @file disableAllCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let forbiddenCommands = [
    'disableAllCommands',
    'disableCommand',
    'disableModule',
    'enableAllCommands',
    'enableCommand',
    'enableModule'
  ];

  Bastion.commands.filter(cmd => {
    (!forbiddenCommands.includes(cmd.help.name)) ? cmd.config.enabled = false : cmd.config.enabled = true;
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: 'All commands have been disabled until next restart. You can enable all commands using `enableAllCommands`. Or you can enable any specific module or command using `enableModule <module_name>` or `enableCommand <command_name>` respectively.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disableAllModules', 'disableAllCmds', 'disableAllMdls' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'disableAllCommands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disableAllCommands',
  example: []
};
