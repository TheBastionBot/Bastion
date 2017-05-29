/**
 * @file lmgtfy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Let me Google that for you:',
      description: `https://lmgtfy.com/?q=${encodeURIComponent(args.join(' '))}`,
      footer: {
        text: 'Powered by lmgtfy'
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'lmgtfy',
  description: 'A tool to teach other people how to use Google\'s internet search.',
  botPermission: '',
  userPermission: '',
  usage: 'lmgtfy <text>',
  example: [ 'lmgtfy How to shutdown a computer?' ]
};
