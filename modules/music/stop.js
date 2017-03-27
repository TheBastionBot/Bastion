exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
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
