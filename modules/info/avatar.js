/**
 * @file avatar command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      fields: [
        {
          name: 'User',
          value: user.tag
        },
        {
          name: 'Avatar URL',
          value: user.displayAvatarURL
        }
      ],
      image: {
        url: user.displayAvatarURL
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'av' ],
  enabled: true
};

exports.help = {
  name: 'avatar',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'avatar [@user-mention]',
  example: [ 'avatar @user#001', 'avatar' ]
};
