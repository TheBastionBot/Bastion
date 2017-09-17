/**
 * @file enableModule command
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
    return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'module'), message.channel);
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
  ]
};

exports.help = {
  name: 'enableModule',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'enableModule <module_name>',
  example: [ 'enableModule music' ]
};
