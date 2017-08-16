/**
 * @file Log Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

/* eslint-disable no-console*/
/**
 * Used to display the warning messages.
 * @function Bastion.log.warn
 * @param {...string} message Message(s) to be shown in the warn log.
 * @returns {void}
 */
exports.warn = (...message) => {
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
exports.error = (...message) => {
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
exports.info = (...message) => {
  console.log(COLOR.cyan('[Bastion]: ') + COLOR.yellow(...message));
};

/**
 * Used to display a single messages in the log.
 * @function Bastion.log.message
 * @param {string} message Message to be shown in the log.
 * @returns {void}
 */
exports.message = message => {
  console.log(COLOR.cyan('[Bastion]: ') + message);
};

/**
 * Used to display the error messages.
 * @function Bastion.log.console
 * @param {...string} message Message(s) to be logged in the console.
 * @returns {void}
 */
exports.console = (...message) => {
  console.log(...message);
};
