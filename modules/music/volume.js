/**
 * @file volume command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (message.guild.voiceConnection) {
    if (!Bastion.credentials.ownerId.includes(message.author.id) && !message.guild.voiceConnection.channel.permissionsFor(message.member).has('MUTE_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'volume',
  description: 'Increases/descreases volume of current music by 2% if + or - is specified, respectively. Or if a number is specified, sets the volume to the specified amount.',
  botPermission: '',
  userPermission: 'Mute Members',
  usage: 'volume <+|-|amount>',
  example: [ 'volume +', 'volume -', 'volume 25' ]
};
