/**
 * @file sweep command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let sweepedUser = message.channel.members.filter(m => !m.user.bot).random();

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Sweeped user',
      fields: [
        {
          name: 'User',
          value: sweepedUser.user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: sweepedUser.id,
          inline: true
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sweep',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sweep',
  example: []
};
