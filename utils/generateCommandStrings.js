/**
 * @file Command Strings Generator
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');
const path = xrequire('path');
const util = xrequire('util');
const writeFile = util.promisify(fs.writeFile);

/* eslint-disable no-sync */
let commands = {};

let modules = fs.readdirSync('./commands/').filter(file => fs.statSync(path.join('./commands/', file)).isDirectory());

for (let module of modules) {
  let commandFiles = fs.readdirSync(path.resolve(`./commands/${module}`)).
    filter(file => !fs.statSync(path.resolve('./commands/', module, file)).isDirectory()).
    filter(file => file.endsWith('.js'));

  for (let file of commandFiles) {
    file = file.substr(0, file.length - 3);

    file = xrequire('./commands/', module, file);

    commands[file.help.name] = {
      description: file.help.description,
      module: toTitleCase(module.replace('_', ' '))
    };
  }
}


let keys = Object.keys(commands);
keys.sort();
let sortedCommands = {};
for (let key of keys) {
  sortedCommands[key] = commands[key];
}


/* eslint-disable no-console */
// Generate commands file that will be used by the website to list commands
writeFile(path.resolve('./data', 'commands.json'), JSON.stringify(sortedCommands, null, 2)).
  then(() => console.log('Successfully generated command list for website.')).
  catch(console.error);

// Generate commands file that will be used by Bastion's String Handler
for (let command in sortedCommands) {
  if (sortedCommands.hasOwnProperty(command)) {
    delete sortedCommands[command].module;
  }
}
writeFile(path.resolve('./locales', 'en_us', 'command.json'), JSON.stringify(sortedCommands, null, 2)).
  then(() => console.log('Successfully generated command list for string handler.')).
  catch(console.error);


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
