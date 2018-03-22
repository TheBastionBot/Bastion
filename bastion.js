/**
 * @file The starting point of Bastion
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

if (BASTION.shard) {
  process.title = `Bastion-Shard-${BASTION.shard.id}`;
}
else {
  process.title = 'BastionBot';
}

BASTION.package = require('./package.json');
BASTION.credentials = require('./settings/credentials.json');
BASTION.config = require('./settings/config.json');
BASTION.Constants = Discord.Constants;
BASTION.colors = Discord.Constants.Colors;
BASTION.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

const WebhookHandler = require('./handlers/webhookHandler.js');
BASTION.webhook = new WebhookHandler(BASTION.credentials.webhooks);
BASTION.log = require('./handlers/logHandler');
BASTION.functions = require('./handlers/functionHandler');
const LanguageHandler = require('./handlers/languageHandler');
BASTION.strings = new LanguageHandler();
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
  require('./utils/populateDatabase')(BASTION.db);
});

require('./handlers/eventHandler')(BASTION);

const Modules = require('./handlers/moduleHandler');
BASTION.commands = Modules.commands;
BASTION.aliases = Modules.aliases;

BASTION.login(BASTION.credentials.token).catch(e => {
  BASTION.log.error(e.toString());
  process.exit(1);
});

process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn(`\n[unhandledRejection]\n${rejection}\n[/unhandledRejection]\n`);
});
