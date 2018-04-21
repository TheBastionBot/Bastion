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
BASTION.Constants = Discord.Constants;
BASTION.colors = Discord.Constants.Colors;
BASTION.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('../utils/String.prototype');
require('../utils/Number.prototype');

const WebhookHandler = require('../handlers/webhookHandler.js');
BASTION.webhook = new WebhookHandler(BASTION.credentials.webhooks);
BASTION.log = require('../handlers/logHandler');
BASTION.functions = require('../handlers/functionHandler');
const LanguageHandler = require('../handlers/languageHandler');
BASTION.strings = new LanguageHandler();

const Sequelize = require('sequelize');
BASTION.database = new Sequelize(BASTION.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
BASTION.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  require('../utils/models')(Sequelize, BASTION.database);

  // Load Bastion Database (Depricated)
  // Will be removed once new database is completely implemented
  BASTION.db = require('sqlite');
  BASTION.db.open('./data/Bastion.sqlite').then(db => {
    db.run('PRAGMA foreign_keys = ON');
    require('../utils/populateDatabase')(BASTION.db);
  }).catch(e => {
    BASTION.log.error(e.stack);
    process.exit(1);
  });

  // Load Bastion Events
  require('../handlers/eventHandler')(BASTION);

  // Load Bastion Modules
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
}).catch(e => {
  BASTION.log.error(e.stack);
  process.exit(1);
});
