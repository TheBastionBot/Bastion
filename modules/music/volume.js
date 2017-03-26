exports.run = function(Bastion, message, args) {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
  if (Bastion.credentials.ownerId.indexOf(msg.author.id) < 0 && !voiceChannel.permissionsFor(msg.author).hasPermission('MUTE_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'volume',
  description: 'Increases/descreases volume of current music by 2% if + or - is specified, respectively. Or if a number is specified, sets the volume to the specified amount.',
  permission: '',
  usage: 'volume <+|-|amount>',
  example: ['volume +', 'volume -', 'volume 25']
};
