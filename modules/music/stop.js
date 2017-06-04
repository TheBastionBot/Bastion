/**
 * @file stop command
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
  name: 'stop',
  description: 'Stops music playback, empties the queue and tells the BOT to leave the voice channel.',
  botPermission: '',
  userPermission: 'MUSIC_MASTER',
  usage: 'stop',
  example: []
};
