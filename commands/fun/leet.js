/**
* @file leet command
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

  args = args.join(' ');
  args = args.replace(/a/ig, '4');
  args = args.replace(/e/ig, '3');
  args = args.replace(/l/ig, '1');
  args = args.replace(/o/ig, '0');
  args = args.replace(/s/ig, '5');
  args = args.replace(/t/ig, '7');

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Leet Text',
      description: args
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ '1337' ],
  enabled: true
};

exports.help = {
  name: 'leet',
  description: 'Sends the same message that you had sent, but as leet text.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leet <text>',
  example: [ 'leet Hello, Everyone!' ]
};
