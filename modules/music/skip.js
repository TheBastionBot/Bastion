exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
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
