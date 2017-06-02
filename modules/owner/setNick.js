/**
 * @file setNick command
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

  if (args.length > 0) {
    message.guild.members.get(Bastion.user.id).setNickname(args.join(' ')).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${Bastion.user.username}'s nick is now set to **${args.join(' ')}** on this guild.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.guild.members.get(Bastion.user.id).setNickname('').then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${Bastion.user.username}'s nick has been reset on this guild.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'setn' ],
  enabled: true
};

exports.help = {
  name: 'setnick',
  description: 'Sets the nick of the bot in the current guild. If no nick is given, it resets the nickname.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
