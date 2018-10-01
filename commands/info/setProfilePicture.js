/**
 * @file setProfilePicture command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = args.join(' ');
    if (!/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let userModel = await Bastion.database.models.user.findOne({
      attributes: [ 'avatar' ],
      where: {
        userID: message.author.id
      }
    });

    if (!userModel) return;

    await Bastion.database.models.user.update({
      avatar: args
    },
    {
      where: {
        userID: message.author.id
      },
      fields: [ 'avatar' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Profile Picture Set',
        image: {
          url: args
        },
        footer: {
          text: message.author.tag
        }
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setProfilePicture',
  description: 'Sets your profile picture that shows up in the Bastion user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setProfilePicture <IMAGE_URL>',
  example: [ 'setProfilePicture https://bastionbot.org/avatar.gif' ]
};
