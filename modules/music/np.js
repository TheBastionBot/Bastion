exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'np',
  description: 'Shows the currently playing music.',
  permission: '',
  usage: 'np',
  example: []
};
