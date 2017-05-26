/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

/**
 * Handles/Loads all the funcions for logging messages in console.
 * @module logHandler
 * @param {object} Bastion The Bastion Object
 * @returns {void}
 */
module.exports = Bastion => {
  Bastion.log = {};

  /* eslint-disable no-console*/
  /**
   * Used to display the warning messages.
   * @function Bastion.log.warn
   * @param {...string} message Message(s) to be shown in the warn log.
   * @returns {void}
   */
  Bastion.log.warn = (...message) => {
    console.log(COLOR.yellow('[WARNING]'));
    console.warn(...message);
    console.log(COLOR.yellow('[/WARNING]'));
  };

  /**
   * Used to display the error messages.
   * @function Bastion.log.error
   * @param {...string} message Message(s) to be shown in the error log.
   * @returns {void}
   */
  Bastion.log.error = (...message) => {
    console.log(COLOR.red('[ERROR]'));
    console.log(...message);
    console.trace();
    console.log(COLOR.red('[/ERROR]'));
  };

  /**
   * Used to display the information/notes in logs.
   * @function Bastion.log.info
   * @param {...string} message Message(s) to be shown in the log as information/notes.
   * @returns {void}
   */
  Bastion.log.info = (...message) => {
    console.log(COLOR.cyan('[Bastion]: ') + COLOR.yellow(...message));
  };

  /**
   * Used to display a single messages in the log.
   * @function Bastion.log.message
   * @param {string} message Message to be shown in the log.
   * @returns {void}
   */
  Bastion.log.message = message => {
    console.log(COLOR.cyan('[Bastion]: ') + message);
  };

  /**
   * Used to display the error messages.
   * @function Bastion.log.console
   * @param {...string} message Message(s) to be logged in the console.
   * @returns {void}
   */
  Bastion.log.console = (...message) => {
    console.log(...message);
  };
};
