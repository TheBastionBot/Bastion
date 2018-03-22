/**
 * @file setAvatar command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args.join(' '))) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    await Bastion.user.setAvatar(args.join(' '));

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${Bastion.user.username}'s avatar changed!`
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
  aliases: [ 'setav' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setAvatar',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setavatar <image_url>',
  example: [ 'setavatar https://example.com/avatar.jpeg' ]
};
