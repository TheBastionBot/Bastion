/**
 * @file Language Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const common = require(`../languages/${process.env.LANG}/common.json`);
const error = require(`../languages/${process.env.LANG}/error.json`);
const errorMessage = require(`../languages/${process.env.LANG}/errorMessage.json`);
const commandDescription = require(`../languages/${process.env.LANG}/commandDescription.json`);
const strings = {
  common: common,
  errors: error,
  errorMessage: errorMessage,
  commandDescription: commandDescription
};
const constants = {
  '%bastion%': 'Bastion',
  '%currencyName%': 'Bastion Currency',
  '%_currencyName%': 'Bastion Currencies',
  '%currencySymbol%': 'BC',
  '%bastionSite%': 'https://BastionBot.org',
  '%discordInvLink%': 'https://discord.gg/fzx8fkt'
};

/**
 * Used to handle languages from external files.
 * @module languageHandler
 * @param {string} string The string to be translated
 * @param {string} [namespace='common'] The namespace of the string
 * @returns {string} the translated string
 */
module.exports = (string, namespace = 'common', ...vars) => {
  if (typeof string === 'string' && typeof namespace === 'string') {
    let regex = new RegExp(Object.keys(constants).join('|'), 'gi');
    return strings[namespace][string].replace(regex, matched => constants[matched]).substitute(...vars);
  }
  return '';
};
