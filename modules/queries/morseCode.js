/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

exports.run = function(Bastion, message, args) {
  if (args.length < 1) return;

  args = args.join(' ').toLowerCase();
  const dit = '•';
  const dah = '–';
  const morseCode = {
    "a": dit + dah,
    "b": dah + dit + dit + dit,
    "c": dah + dit + dah + dit,
    "d": dah + dit + dit,
    "e": dit,
    "f": dit + dit + dah + dit,
    "g": dah + dah + dit,
    "h": dit + dit + dit + dit,
    "i": dit + dit,
    "j": dit + dah + dah + dah,
    "k": dah + dit + dah,
    "l": dit + dah + dit + dit,
    "m": dah + dah,
    "n": dah + dit,
    "o": dah + dah + dah,
    "p": dit + dah + dah + dit,
    "q": dah + dah + dit + dah,
    "r": dit + dah + dit,
    "s": dit + dit + dit,
    "t": dah,
    "u": dit + dit + dah,
    "v": dit + dit + dit + dah,
    "w": dit + dah + dah,
    "x": dah + dit + dit + dah,
    "y": dah + dit + dah + dah,
    "z": dah + dah + dit + dit,
    "0": dah + dah + dah + dah + dah,
    "1": dit + dah + dah + dah + dah,
    "2": dit + dit + dah + dah + dah,
    "3": dit + dit + dit + dah + dah,
    "4": dit + dit + dit + dit + dah,
    "5": dit + dit + dit + dit + dit,
    "6": dah + dit + dit + dit + dit,
    "7": dah + dah + dit + dit + dit,
    "8": dah + dah + dah + dit + dit,
    "9": dah + dah + dah + dah + dit,
    ".": dit + dah + dit + dah + dit + dah,
    ",": dah + dah + dit + dit + dah + dah,
    "?": dit + dit + dah + dah + dit + dit,
    "'": dit + dah + dah + dah + dah + dit,
    "!": dah + dit + dah + dit + dah + dah,
    "/": dah + dit + dit + dah + dit,
    "(": dah + dit + dah + dah + dit,
    ")": dah + dit + dah + dah + dit + dah,
    "&": dit + dah + dit + dit + dit,
    ":": dah + dah + dah + dit + dit + dit,
    ";": dah + dit + dah + dit + dah + dit,
    "=": dah + dit + dit + dit + dah,
    "+": dit + dah + dit + dah + dit,
    "-": dah + dit + dit + dit + dit + dah,
    "\"": dit + dah + dit + dit + dah + dit,
    "$": dit + dit + dit + dah + dit + dit + dah,
    "@": dit + dah + dah + dit + dah + dit,
    " ": " "
  };
  args = args.replace(/./g, x => morseCode[x]+' ').trim();

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'Morse Code',
    description: `**${args}**`
  }});
};

exports.conf = {
  aliases: ['morse']
};

exports.help = {
  name: 'morsecode',
  description: 'Encodes a given text into Morse Code.',
  permission: '',
  usage: ['morseCode Shh! This is a secret.']
};
