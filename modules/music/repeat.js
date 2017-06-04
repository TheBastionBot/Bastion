/**
 * @file repeat command
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
  name: 'repeat',
  description: 'Toggles the currently playing song to/from the repeat queue.',
  botPermission: '',
  userPermission: '',
  usage: 'repeat',
  example: []
};
