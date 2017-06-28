/**
 * @file Language Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const common = require(`../languages/${process.env.LANG}/common.json`);
const errors = require(`../languages/${process.env.LANG}/errors.json`);
const errorMessage = require(`../languages/${process.env.LANG}/errorMessage.json`);
const commandDescription = require(`../languages/${process.env.LANG}/commandDescription.json`);
const strings = {
  common: common,
  errors: errors,
  errorMessage: errorMessage,
  commandDescription: commandDescription
};
const constants = {
  '%bastion%': strings['common']['bastion'],
  '%currencyName%': strings['common']['currencyName'],
  '%_currencyName%': strings['common']['_currencyName'],
  '%currencySymbol%': strings['common']['currencySymbol'],
  '%discordInvLink%': strings['common']['discordInvLink']
};

/**
 * Used to handle languages from external files.
 * @module languageHandler
 * @param {string} string The string to be translated
 * @param {string} [namespace='common'] The namespace of the string
 * @returns {string} the translated string
 */
module.exports = (string, namespace = 'common') => {
  if (typeof string === 'string' && typeof namespace === 'string') {
    let regex = new RegExp(Object.keys(constants).join('|'), 'gi');
    return strings[namespace][string].replace(regex, matched => constants[matched]);
  }
  return '';
};
