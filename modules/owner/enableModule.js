/**
 * @file enableModule command
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

  let module = args.name.toLowerCase();

  if (Bastion.commands.map(c => c.config.module).includes(module)) {
    Bastion.commands.filter(c => c.config.module === module).filter(c => {
      c.config.enabled = true;
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
      color: Bastion.colors.GREEN,
      description: `\`${module}\` module has been enabled.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablemdl' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'enableModule',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'enableModule <module_name>',
  example: [ 'enableModule music' ]
};
