/**
 * @file Module Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const color = require('chalk');
const { Collection } = require('discord.js');
const commandInfo = require('../locales/en_us/command.json');

/* eslint-disable no-sync */
let Commands = new Collection();
let Aliases = new Collection();

let commandFiles = fs.readdirSync(path.resolve('./modules/')).
  filter(file => !fs.statSync(path.resolve('./modules/', file)).isDirectory());

for (let file of commandFiles) {
  file = file.substr(0, file.length - 3);
  process.stdout.write(`${color.cyan('[Bastion]:')} Loading ${file} command...\n`);
  file = require(path.resolve(`./modules/${file}`));
  Commands.set(file.help.name.toLowerCase(), file);
  file.config.module = commandInfo[file.help.name].module;
  for (let alias of file.config.aliases) {
    Aliases.set(alias.toLowerCase(), file.help.name);
  }

  if (process.stdout.moveCursor) {
    process.stdout.moveCursor(0, -1);
  }
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
  }
}

exports.commands = Commands;
exports.aliases = Aliases;
