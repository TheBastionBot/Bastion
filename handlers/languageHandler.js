/**
 * @file Language Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const common = require(`../languages/${process.env.LANG}/common.json`);
const errors = require(`../languages/${process.env.LANG}/errors.json`);
const commandDescription = require(`../languages/${process.env.LANG}/commandDescription.json`);
const strings = {
  common: common,
  errors: errors,
  commandDescription: commandDescription
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
    return strings[namespace][string];
  }
  return undefined;
};
