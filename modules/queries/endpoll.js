/**
 * @file endpoll command
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
  name: 'endpoll',
  description: 'Ends an ongoing poll and shows the result.',
  botPermission: '',
  userPermission: '',
  usage: 'endpoll',
  example: []
};
