/**
 * @file rot13 command
 * @author Ruben Roy
 * @license GPL-3.0
 */

/**
 * Encodes string to ROT13
 * See {@link https://en.wikipedia.org/wiki/ROT13|Wikipedia} article
 * @param {string} str - The string to encode
 * @returns {string} The encoded string
 */
const rot13 = (str) => {
  const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.split('');
  const lookup = input.reduce((m, k, i) => Object.assign(m, { [k]: output[i] }), {});
  return str.split('').map(x => lookup[x] || x).join('');
};

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
      color: Bastion.colors.DEFAULT,
      description: rot13(args.join(' '))
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
  name: 'rot13',
  description: 'Sends the message that you had sent, rot13 encoded.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rot13 <text>',
  example: [ 'rot13 Hello, world!' ]
};
