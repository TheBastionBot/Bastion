/**
 * @file Language Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const log = require('./logHandler');

const locales = new Discord.Collection();
const languages = fs.readdirSync('./locales/').filter(file => fs.statSync(path.join('./locales/', file)).isDirectory());
const constants = {
  '%bastion%': 'Bastion',
  '%currencyName%': 'Bastion Currency',
  '%_currencyName%': 'Bastion Currencies',
  '%currencySymbol%': 'BC',
  '%bastionSite%': 'https://BastionBot.org',
  '%discordInvLink%': 'https://discord.gg/fzx8fkt'
};

for (let language of languages) {
  log.info(`Loading language: ${language}`);
  const strings = {};
  let stringFiles = fs.readdirSync(`./locales/${language}`);

  for (let stringFile of stringFiles) {
    let file = stringFile.substr(0, stringFile.length - 5);
    log.message(`Loading strings in ${file}`);
    stringFile = require(`../locales/${language}/${stringFile}`);
    strings[file] = stringFile;
  }

  locales.set(language, strings);
  log.info('Done.');
}

/**
 * Used to handle strings of different languages from external files.
 * @module languageHandler
 */
module.exports = class LanguageHandler {
  /**
   * @constructor
   */
  constructor() {
    this.locales = locales;
  }

  /**
   * Returns a list of languages supported by Bastion
   * @function getAvailableLanguages
   * @returns {Array} Array of languages supported by Bastion
   */
  get availableLanguages() {
    return languages;
  }

  /**
   * Returns the error message string for the given key.
   * @function error
   * @param {String} locale The locale of the string
   * @param {String} key The key of the string
   * @param {Boolean} description Whether to return the description or the title
   * @returns {String} The string mapped by the key and namespace
   */
  error(locale, key, description = false, ...vars) {
    if (!this.locales.has(locale)) {
      locale = 'en';
    }

    let namespace, regex = new RegExp(Object.keys(constants).join('|'), 'gi');
    if (description) {
      if (!this.locales.get(locale).errors['descriptions'][key]) {
        return `No string found for '${key}' in error descriptions.`;
      }
      namespace = 'descriptions';
    }
    else {
      if (!this.locales.get(locale).errors['types'][key]) {
        return `No string found for '${key}' in error types.`;
      }
      namespace = 'types';
    }
    return this.locales.get(locale).errors[namespace][key].replace(regex, matched => constants[matched]).substitute(...vars);
  }

  /**
   * Returns the command description string for the given key.
   * @function command
   * @param {String} locale The locale of the string
   * @param {String} module The module that is mapped to the command
   * @param {String} command The command that is mapped to the string
   * @returns {String} The string mapped by the command and module
   */
  command(locale, module, command) {
    if (!this.locales.has(locale)) {
      locale = 'en';
    }

    if (!this.locales.get(locale).modules[module] || !this.locales.get(locale).modules[module][command]) {
      return `No string found for '${command}' command in ${module} module.`;
    }

    return this.locales.get(locale).modules[module][command];
  }
};
