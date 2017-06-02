/**
 * @file messageUser command
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

  if (Bastion.users.get(args[0])) {
    Bastion.users.get(args[0]).send({
      embed: {
        color: Bastion.colors.blue,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'msgu' ],
  enabled: true
};

exports.help = {
  name: 'messageuser',
  description: 'Sends a private message to a specified user (by ID) of a server the bot is connected to.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'messageUser <user_id> <message>',
  example: [ 'messageUser USER_ID Hello, how are you?' ]
};
