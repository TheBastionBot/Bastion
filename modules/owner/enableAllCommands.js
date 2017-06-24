/**
 * @file enableAllCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.commands.filter(cmd => {
    cmd.config.enabled = true;
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      description: 'All commands have been enabled.'
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'enableallcmds' ],
  enabled: true
};

exports.help = {
  name: 'enableallcommands',
  description: 'Enables all temporarily disabled commands.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'enableAllCommands',
  example: []
};
