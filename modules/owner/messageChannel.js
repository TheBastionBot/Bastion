/**
 * @file messageChannel command
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

  if (!(parseInt(args[0]) < 9223372036854775807)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (Bastion.channels.get(args[0])) {
    Bastion.channels.get(args[0]).send({
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
  aliases: [ 'msgc' ],
  enabled: true
};

exports.help = {
  name: 'messagechannel',
  description: 'Sends a message to a specified channel (by ID) of a server the bot is connected tos.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'messageChannel <channel_id> <message>',
  example: [ 'messageChannel CHANNEL_ID Hello everyone!' ]
};
