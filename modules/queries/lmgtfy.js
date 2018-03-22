/**
 * @file lmgtfy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Let me Google that for you:',
      description: `https://lmgtfy.com/?q=${encodeURIComponent(args.join(' '))}`,
      footer: {
        text: 'Powered by lmgtfy'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'lmgtfy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lmgtfy <text>',
  example: [ 'lmgtfy How to shutdown a computer?' ]
};
