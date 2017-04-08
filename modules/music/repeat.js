exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'repeat',
  description: 'Toggles the currently playing song to/from the repeat queue.',
  permission: '',
  usage: 'repeat',
  example: []
};
