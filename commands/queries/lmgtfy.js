/**
 * @file lmgtfy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
      title: 'Let me search that for you:',
      description: `https://lmgtfy.com/?s=d&q=${encodeURIComponent(args.join(' '))}`,
      footer: {
        text: 'Powered by lmgtfy'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'lmstfy', 'lmdtfy' ],
  enabled: true
};

exports.help = {
  name: 'lmgtfy',
  description: 'Teach users how to do an internet search and get answers to their questions.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lmgtfy <text>',
  example: [ 'lmgtfy How to shutdown a computer?' ]
};
