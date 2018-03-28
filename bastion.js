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

const Sequelize = require('sequelize');
BASTION.database = new Sequelize(BASTION.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
BASTION.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  require('./utils/models')(Sequelize, BASTION.database);

  // Load Bastion Database (Depricated)
  // Will be removed once new database is completely implemented
  BASTION.db = require('sqlite');
  BASTION.db.open('./data/Bastion.sqlite').then(db => {
    db.run('PRAGMA foreign_keys = ON');
    require('./utils/populateDatabase')(BASTION.db);
  });

  // Load Bastion Events
  require('./handlers/eventHandler')(BASTION);

  // Load Bastion Modules
  const Modules = require('./handlers/moduleHandler');
  BASTION.commands = Modules.commands;
  BASTION.aliases = Modules.aliases;

  // Start Bastion
  BASTION.login(BASTION.credentials.token).then(() => {
    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    BASTION.database.models.settings.findOrBuild({
      where: {
        botID: BASTION.user.id
      }
    }).spread((settingsModel, initialized) => {
      if (initialized) {
        return settingsModel.save();
      }
    }).catch(BASTION.log.error);
  }).catch(e => {
    BASTION.log.error(e.toString());
    process.exit(1);
  });
}).catch(err => {
  BASTION.log.error(err);
});

process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn(`\n[unhandledRejection]\n${rejection}\n[/unhandledRejection]\n`);
});
