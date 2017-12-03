/**
 * @file enableAllCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  Bastion.commands.filter(cmd => {
    cmd.config.enabled = true;
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'All commands have been enabled.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enableallmodules', 'enableallcmds', 'enableallmdls' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'enableAllCommands',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'enableAllCommands',
  example: []
};
