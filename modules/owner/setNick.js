/**
 * @file setNick command
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
    if (args.length > 0) {
      await message.guild.members.get(Bastion.user.id).setNickname(args.join(' '));

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s nick is now set to **${args.join(' ')}** on this guild.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await message.guild.members.get(Bastion.user.id).setNickname('');

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s nick has been reset on this guild.`
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
  aliases: [ 'setn' ],
  enabled: true
};

exports.help = {
  name: 'setNick',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
