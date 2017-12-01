/**
 * @file setUsername command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.join(' ').length >= 1) {
      await Bastion.user.setUsername(args.join(' '));

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `${Bastion.user.username}'s username is now set to **${args.join(' ')}**`
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
  aliases: [ 'setun' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setUsername',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setUsername <text>',
  example: [ 'setUsername NewUsername' ]
};
