/**
 * @file pirateSpeak command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const dictionary = require('../../data/piratePhrases.json');

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
      title: 'Pirate Speak:',
      description: translate(args.join(' '))
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'pirate' ],
  enabled: true
};

exports.help = {
  name: 'pirateSpeak',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pirateSpeak <text>',
  example: [ 'pirateSpeak You can always trust the untrustworthy because you can always trust that they will be untrustworthy. Its the trustworthy you can\'t trust.' ]
};

/**
 * Translates a string to pirate speak.
 * @function translate
 * @param {string} text The string to be translated to pirate speak.
 * @returns {string} The translated pirate speak string.
*/
function translate(text) {
  let translatedText = '';
  // Loop through the text, one character at a time.
  let word = '';
  for (let i = 0; i < text.length; i += 1) {
    let character = text[i];
    // If the character is a letter, then we are in the middle of a word, so we should accumulate the letter into the word variable.
    if (isLetter(character)) {
      word += character;
    }
    // If the character is not a letter, then we hit the end of a word, so we should translate the current word and add it to the translation.
    else {
      if (word !== '') {
        // If we've just finished a word, translate it
        let pirateWord = translateWord(word);
        translatedText += pirateWord;
        word = '';
      }
      translatedText += character; // Add the non-letter character
    }
  }
  // If we ended the loop before translating a word, then translate the final word and add it to the translation.
  if (word !== '') translatedText += translateWord(word);
  return translatedText;
}

/**
 * Checks if a character is a letter.
 * @function isLetter
 * @param {string} character The character to check.
 * @returns {boolean} If the character is a letter or not.
*/
function isLetter(character) {
  if (character.search(/[a-zA-Z'-]/) === -1) return false;
  return true;
}

/**
 * Translates a word to pirate speak word.
 * @function translateWord
 * @param {string} word The word to be translated to pirate speak.
 * @returns {function} applyCase
*/
function translateWord(word) {
  let pirateWord = dictionary[word.toLowerCase()];
  if (pirateWord === undefined) return word;
  return applyCase(word, pirateWord);
}

/**
 * Apply the case of the original word to the pirate speak word.
 * @function applyCase
 * @param {string} wordA The original word to be translated.
 * @param {string} wordB The translated pirate speak word.
 * @returns {string} The translated pirate speak word with the applied casing.
*/
function applyCase(wordA, wordB) {
  if (wordA.length === 1 && wordB.length !== 1) return wordB;
  if (wordA === wordA.toUpperCase()) return wordB.toUpperCase();
  if (wordA === wordA.toLowerCase()) return wordB.toLowerCase();

  let firstChar = wordA.slice(0, 1);
  let otherChars = wordA.slice(1);
  if (firstChar === firstChar.toUpperCase() && otherChars === otherChars.toLowerCase()) {
    return wordB.slice(0, 1).toUpperCase() + wordB.slice(1).toLowerCase();
  }

  return wordB;
}
