/**
 * @file listFilesSync
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = require('fs');

module.exports = dir => {
  // eslint-disable-next-line no-sync
  return fs.readdirSync(`./${dir}`);
};
