exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'queue',
  description: 'Shows the list of music in the queue.',
  permission: '',
  usage: 'queue',
  example: []
};
