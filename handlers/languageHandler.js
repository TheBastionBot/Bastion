/**
 * @file Language Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const common = require(`../languages/${process.env.LANG}/common.json`);
const strings = {
  common: common
};

/**
 * Handles all the languages supported by Bastion.
 * @module languageHandler
 * @param {object} Bastion The Bastion Object.
 * @returns {void}
 */
module.exports = Bastion => {
  /**
   * Used to display the warning messages.
   * @function Bastion.translate
   * @param {string} string The string to be translated
   * @param {string} [namespace='common'] The namespace of the string
   * @returns {string} the translated string
   */
  Bastion.translate = (string, namespace = 'common') => {
    return strings[namespace][string];
  };
};
