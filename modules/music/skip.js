exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
  if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'skip',
  description: 'Skips the current music and plays the next music in the queue (if any).',
  permission: '',
  usage: 'skip',
  example: []
};
