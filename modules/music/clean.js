exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'clean',
  description: 'Cleans up the current music queue.',
  permission: '',
  usage: 'clean',
  example: []
};
