exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'shuffle',
  description: 'Shuffles the songs in the current queue.',
  permission: '',
  usage: 'shuffle',
  example: []
};
