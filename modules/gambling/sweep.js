/**
 * @file sweep command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  let sweepedUser = message.channel.members.filter(m => !m.user.bot).random();

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
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
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sweep',
  description: 'Shows a random user from the channel.',
  botPermission: '',
  userPermission: '',
  usage: 'sweep',
  example: []
};
