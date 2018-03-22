/**
 * @file Test script to test Bastion's successful booting
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Discord = require('discord.js');
const BASTION = new Discord.Client({
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

BASTION.package = require('../package.json');
BASTION.credentials = require('../settings/credentials.json');
BASTION.config = require('../settings/config.json');
BASTION.colors = Discord.Constants.Colors;

// require('./utils/Array.prototype');
require('../utils/String.prototype');
require('../utils/Number.prototype');

BASTION.log = require('../handlers/logHandler');
BASTION.functions = require('../handlers/functionHandler');
const LanguageHandler = require('../handlers/languageHandler');
BASTION.strings = new LanguageHandler();
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
  require('../utils/populateDatabase')(BASTION.db);
}).catch(e => {
  BASTION.log.error(e.stack);
  process.exit(1);
});

require('../handlers/eventHandler')(BASTION);

const Modules = require('../handlers/moduleHandler');
BASTION.commands = Modules.commands;
BASTION.aliases = Modules.aliases;

if (BASTION.commands && BASTION.aliases) {
  BASTION.log.info(`Successfully loaded ${BASTION.commands.size} commands`);
}
else {
  BASTION.log.error('Failed to load commands.');
  process.exit(1);
}
