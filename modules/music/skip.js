/**
 * @file skip command
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
  name: 'skip',
  description: 'Skips the current music and plays the next music in the queue (if any).',
  botPermission: '',
  userPermission: '',
  usage: 'skip',
  example: []
};
