/**
 * @file Module Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const log = require('./logHandler');

/* eslint-disable no-sync */
let commands = new Map();
let aliases = new Map();
let modules = fs.readdirSync('./modules/').filter(file => fs.statSync(path.join('./modules/', file)).isDirectory());

for (let module of modules) {
  let commandFiles = fs.readdirSync(`./modules/${module}`);
  log.info(`Loading module: ${module} [${commandFiles.length} commands]`);
  for (let file of commandFiles) {
    file = file.substr(0, file.length - 3);
    log.message(`Loading command: ${file}`);
    file = require(`../modules/${module}/${file}`);
    commands.set(file.help.name.toLowerCase(), file);
    file.config.module = module;
    for (let alias of file.config.aliases) {
      aliases.set(alias.toLowerCase(), file.help.name);
    }
  }
  log.info('Done.');
}

exports.commands = commands;
exports.aliases = aliases;
