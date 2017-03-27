exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
  if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'stop',
  description: 'Stops music playback, empties the queue and tells the BOT to leave the voice channel.',
  permission: '',
  usage: 'stop',
  example: []
};
