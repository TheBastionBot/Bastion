/**
 * @file rot13 command
 * @author Ruben Roy
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: message.author.tag
      },
      title: 'ROT13 Encoded',
      description: Bastion.methods.rot(args.join(' '), 13),
      footer: {
        text: 'Encoded your message in ROT13.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'rot13',
  description: 'Sends the message that you had sent, rot13 encoded.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rot13 <MESSAGE>',
  example: [ 'rot13 Hello, world!' ]
};
