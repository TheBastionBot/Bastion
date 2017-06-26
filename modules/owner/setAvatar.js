/**
 * @file setAvatar command
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

  if (!/^(https?:\/\/)((([a-z0-9]{1,})?(-?)+[a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9-~#%])+\/)+)?([a-z0-9_-~#%]+)\.(jpg|jpeg|gif|png)$/i.test(args.join(' '))) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
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
  description: string('setAvatar', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setavatar <image_url>',
  example: [ 'setavatar https://example.com/avatar.jpeg' ]
};
