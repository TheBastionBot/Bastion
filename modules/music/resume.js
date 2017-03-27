exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'resume',
  description: 'Resumes the paused music playback.',
  permission: '',
  usage: 'resume',
  example: []
};
