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

const dictionary = require('../../data/piratePhrases.json');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.channel.send({embed: {
    color: Bastion.colors.blue,
    title: 'Pirate Speak:',
    description: translate(args.join(' '))
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['pirate']
};

exports.help = {
  name: 'piratespeak',
  description: 'Convert\'s the given text to pirate speak.',
  botPermission: '',
  userPermission: '',
  usage: 'pirateSpeak <text>',
  example: ['pirateSpeak You can always trust the untrustworthy because you can always trust that they will be untrustworthy. Its the trustworthy you can’t trust.']
};

function translateWord(word) {
	let pirateWord = dictionary[word.toLowerCase()];
	if (pirateWord === undefined) return word;
	else return applyCase(word, pirateWord);
}

function applyCase(wordA, wordB) {
  if (wordA.length === 1 && wordB.length !== 1) return wordB;
  if (wordA === wordA.toUpperCase()) return wordB.toUpperCase();
  if (wordA === wordA.toLowerCase()) return wordB.toLowerCase();

  let firstChar = wordA.slice(0, 1);
  let otherChars = wordA.slice(1);
  if (firstChar === firstChar.toUpperCase() && otherChars === otherChars.toLowerCase())
    return wordB.slice(0, 1).toUpperCase() + wordB.slice(1).toLowerCase();

  return wordB;
};

function isLetter(character) {
  if (character.search(/[a-zA-Z'-]/) === -1) return false;
  return true;
}

function translate(text) {
  let translatedText = "";
  // Loop through the text, one character at a time.
  let word = "";
  for (let i = 0; i < text.length; i += 1) {
    let character = text[i];
    // If the character is a letter, then we are in the middle of a word, so we should accumulate the letter into the word variable.
    if (isLetter(character))
      word += character;
    // If the character is not a letter, then we hit the end of a word, so we should translate the current word and add it to the translation.
    else {
      if (word !== "") {
        // If we've just finished a word, translate it
        let pirateWord = translateWord(word);
        translatedText += pirateWord;
        word = "";
      }
      translatedText += character; // Add the non-letter character
    }
  }
  // If we ended the loop before translating a word, then translate the final word and add it to the translation.
  if (word !== "") translatedText += translateWord(word);
  return translatedText;
};
