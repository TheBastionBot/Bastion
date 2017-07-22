/**
 * @file warn event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = info => {
  /* eslint-disable no-console */
  console.log(COLOR.yellow('[WARNING EVENT]'));
  console.log(info);
  console.log(COLOR.yellow('[/WARNING EVENT]'));
  /* eslint-enable no-console */
};
