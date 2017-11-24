/**
 * @file deleteTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  if (!args[0]) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    await Bastion.db.run(`DELETE FROM triggers WHERE trigger="${args.join(' ').replace(/"/g, '\'')}"`);

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Trigger deleted',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true
};

exports.help = {
  name: 'deleteTrigger',
  botPermission: '',
  userTextPermission: 'BOT_OWNER',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
