/**
 * @file disableModule command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let module = args.name.toLowerCase(),
    forbiddenCommands = [
      'disableallcommands',
      'disablecommand',
      'disablemodule',
      'enableallcommands',
      'enablecommand',
      'enablemodule'
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
  ]
};

exports.help = {
  name: 'disableModule',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'disableModule <module_name>',
  example: [ 'disableModule music' ]
};
