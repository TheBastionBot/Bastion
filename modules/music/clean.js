/**
 * @file clean command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'clean',
  description: 'Cleans up the current music queue.',
  botPermission: '',
  userPermission: 'MUSIC_MASTER',
  usage: 'clean',
  example: []
};
