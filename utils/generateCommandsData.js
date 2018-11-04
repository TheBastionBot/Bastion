/**
 * @file Command Data Generator
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const modules = require('../locales/en/modules.json');
const writeFile = promisify(fs.writeFile);

/**
 * Convert a string to Title Case.
 * @function toTitleCase
 * @param {String} string the string to be converted
 * @returns {String} the input string in Title Case
 */
function toTitleCase(string) {
  let newstr = string.split(' ');
  for (let i = 0; i < newstr.length; i++) {
    if (newstr[i] === '') continue;
    let copy = newstr[i].substring(1).toLowerCase();
    newstr[i] = newstr[i][0].toUpperCase() + copy;
  }
  newstr = newstr.join(' ');
  return newstr;
}

let commands = {};
for (let module in modules) {
  if (modules.hasOwnProperty(module)) {
    for (let command in modules[module]) {
      if (modules[module].hasOwnProperty(command)) {
        commands[command] = {
          description: modules[module][command],
          module: toTitleCase(module.replace('_', ' '))
        };
      }
    }
  }
}

// Generate commands data
/* eslint-disable no-console */
writeFile(path.resolve('./data', 'commands.json'), JSON.stringify(commands, null, 2)).
  then(() => console.log('Successfully generated commands data')).
  catch(console.error);
