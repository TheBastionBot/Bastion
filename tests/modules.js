/**
 * @file Test script to test if commands have been described.
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const _ = xrequire('lodash');
let chalk = xrequire('chalk');
let moduleHandler = xrequire('./handlers/moduleHandler');
const commandInfo = xrequire('./locales/en_us/command.json');

let describedCommands = Object.keys(commandInfo);
describedCommands = describedCommands.map(command => command.toLowerCase());

let availableCommands = Array.from(moduleHandler.commands.keys());
availableCommands = availableCommands.map(command => command.toLowerCase());

let status, message;

let unavailableCommands = _.difference(describedCommands, availableCommands);
if (unavailableCommands.length > 0) {
  status = 'WARN';
  message = `${unavailableCommands.length} extra commands have been described in the command strings, but aren't available in modules.`;
}
else {
  status = 'OK';
  message = 'All the described commands are available.';
}
log(status, message);

let undescribedCommands = _.difference(availableCommands, describedCommands);
if (undescribedCommands.length > 0) {
  status = 'ERROR';
  message = `${undescribedCommands.length} extra commands are available in modules, but aren't described in the command strings.`;
}
else {
  status = 'OK';
  message = 'All the available commands are described.';
}
log(status, message);

/**
 * Handles the logging of status messages
 * @function log
 * @param {Number} status The status code
 * @param {String} message The message to log
 * @returns {void}
 */
function log(status, message) {
  let level = 'log', color = 'green';
  if (status === 'WARN') {
    level = 'warn';
    color = 'yellow';
  }
  else if (status === 'ERROR') {
    level = 'error';
    color = 'red';
  }

  // eslint-disable-next-line no-console
  console[level](chalk`{${color} [${status}]} ${message}\n`);

  if (status === 'ERROR') {
    process.exit(1);
  }
}
