/**
 * @file leave command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!/^[0-9]{18}$/.test(args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (Bastion.guilds.get(args[0]).available) {
    Bastion.guilds.get(args[0]).leave().catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'leave',
  description: 'Tells the bot to leave a specified server by ID.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'leave <guild_id>',
  example: [ 'leave 441122339988775566' ]
};
