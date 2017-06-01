/**
 * @file setAvatar command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!/^(https?:\/\/)((([a-z0-9]{1,})?(-?)+[a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9-~#%])+\/)+)?([a-z0-9_-~#%]+)\.(jpg|jpeg|gif|png)$/i.test(args.join(' '))) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  Bastion.user.setAvatar(args.join(' ')).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: `${Bastion.user.username}'s avatar changed!`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'setav' ],
  enabled: true
};

exports.help = {
  name: 'setavatar',
  description: 'Sets the avatar of the Bot.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setavatar <image_url>',
  example: [ 'setavatar https://example.com/avatar.jpeg' ]
};
