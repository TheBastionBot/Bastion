/**
 * @file setStatus command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    if (args.status && /^(?:online|idle|dnd|invisible)$/i.test(args.status)) {
      await Bastion.user.setStatus(args.status);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s status is now set to **${args.status}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await Bastion.user.setStatus(Bastion.config.status);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s status is now set to the default status **${Bastion.config.status}**`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'status', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'setStatus',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: [ 'setStatus invisible', 'setStatus' ]
};
