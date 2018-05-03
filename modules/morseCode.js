/**
 * @file morseCode command
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

  args = args.join(' ').toLowerCase();
  const dit = '•';
  const dah = '–';
  const morseCode = {
    'a': dit + dah,
    'b': dah + dit + dit + dit,
    'c': dah + dit + dah + dit,
    'd': dah + dit + dit,
    'e': dit,
    'f': dit + dit + dah + dit,
    'g': dah + dah + dit,
    'h': dit + dit + dit + dit,
    'i': dit + dit,
    'j': dit + dah + dah + dah,
    'k': dah + dit + dah,
    'l': dit + dah + dit + dit,
    'm': dah + dah,
    'n': dah + dit,
    'o': dah + dah + dah,
    'p': dit + dah + dah + dit,
    'q': dah + dah + dit + dah,
    'r': dit + dah + dit,
    's': dit + dit + dit,
    't': dah,
    'u': dit + dit + dah,
    'v': dit + dit + dit + dah,
    'w': dit + dah + dah,
    'x': dah + dit + dit + dah,
    'y': dah + dit + dah + dah,
    'z': dah + dah + dit + dit,
    '0': dah + dah + dah + dah + dah,
    '1': dit + dah + dah + dah + dah,
    '2': dit + dit + dah + dah + dah,
    '3': dit + dit + dit + dah + dah,
    '4': dit + dit + dit + dit + dah,
    '5': dit + dit + dit + dit + dit,
    '6': dah + dit + dit + dit + dit,
    '7': dah + dah + dit + dit + dit,
    '8': dah + dah + dah + dit + dit,
    '9': dah + dah + dah + dah + dit,
    '.': dit + dah + dit + dah + dit + dah,
    ',': dah + dah + dit + dit + dah + dah,
    '?': dit + dit + dah + dah + dit + dit,
    '\'': dit + dah + dah + dah + dah + dit,
    '!': dah + dit + dah + dit + dah + dah,
    '/': dah + dit + dit + dah + dit,
    '(': dah + dit + dah + dah + dit,
    ')': dah + dit + dah + dah + dit + dah,
    '&': dit + dah + dit + dit + dit,
    ':': dah + dah + dah + dit + dit + dit,
    ';': dah + dit + dah + dit + dah + dit,
    '=': dah + dit + dit + dit + dah,
    '+': dit + dah + dit + dah + dit,
    '-': dah + dit + dit + dit + dit + dah,
    '"': dit + dah + dit + dit + dah + dit,
    '$': dit + dit + dit + dah + dit + dit + dah,
    '@': dit + dah + dah + dit + dah + dit,
    'à': dit + dah + dah + dit + dah,
    'ä': dit + dah + dit + dah,
    'å': dit + dah + dah + dit + dah,
    'ą': dit + dah + dit + dah,
    'æ': dit + dah + dit + dah,
    'ć': dah + dit + dah + dit + dit,
    'ĉ': dah + dit + dah + dit + dit,
    'ç': dah + dit + dah + dit + dit,
    'ch': dah + dah + dah + dah,
    'đ': dit + dit + dah + dit + dit,
    'ð': dit + dit + dah + dah + dit,
    'é': dit + dit + dah + dit + dit,
    'è': dit + dah + dit + dit + dah,
    'ę': dit + dit + dah + dit + dit,
    'ĝ': dah + dah + dit + dah + dit,
    'ĥ': dah + dah + dah + dah,
    'ĵ': dit + dah + dah + dah + dit,
    'ł': dit + dah + dit + dit + dah,
    'ń': dah + dah + dit + dah + dah,
    'ñ': dah + dah + dit + dah + dah,
    'ó': dah + dah + dah + dit,
    'ö': dah + dah + dah + dit,
    'ø': dah + dah + dah + dit,
    'ś': dit + dit + dit + dah + dit + dit + dit,
    'ŝ': dit + dit + dit + dah + dit,
    'š': dah + dah + dah + dah,
    'þ': dit + dah + dah + dit + dit,
    'ü': dit + dit + dah + dah,
    'ŭ': dit + dit + dah + dah,
    'ź': dah + dah + dit + dit + dah + dit,
    'ż': dah + dah + dit + dit + dah,
    ' ': '\u2007'
  };
  args = args.replace(/./g, x => `${morseCode[x]}\u2001`).trim();

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Morse Code',
      description: `**${args}**`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'morse' ],
  enabled: true
};

exports.help = {
  name: 'morseCode',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'morseCode <text>',
  example: [ 'morseCode Shh! This is a secret.' ]
};
