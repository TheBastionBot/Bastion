/**
 * @file disableModule command
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

  let module = args.name.toLowerCase(),
    forbiddenCommands = [
      'disableAllCommands',
      'disableCommand',
      'disableModule',
      'enableAllCommands',
      'enableCommand',
      'enableModule'
    ];

  if (Bastion.commands.map(c => c.config.module).includes(module)) {
    Bastion.commands.filter(c => c.config.module === module).filter(c => {
      (!forbiddenCommands.includes(c.help.name)) ? c.config.enabled = false : c.config.enabled = true;
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'module'), message.channel);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.RED,
      description: `\`${module}\` module has been disabled until next restart. You can turn on this command using \`enableModule ${module}\`.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablemdl' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'disableModule',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disableModule <module_name>',
  example: [ 'disableModule music' ]
};
