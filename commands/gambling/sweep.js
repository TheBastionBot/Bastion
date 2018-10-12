/**
 * @file sweep command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
  description: 'Shows a random user from the text channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sweep',
  example: []
};
