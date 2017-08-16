/**
 * @file Function Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const fs = require('fs');

// eslint-disable-next-line no-sync
let functions = fs.readdirSync('./functions/');
for (let method of functions) {
  exports[method.replace('.js', '')] = require(`../functions/${method}`);
}
