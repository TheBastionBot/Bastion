exports.run = (Bastion, message, args) => {
  message.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
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
