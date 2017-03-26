exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'pause',
  description: 'Pauses the current music playback.',
  permission: '',
  usage: 'pause',
  example: []
};
