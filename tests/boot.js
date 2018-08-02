/**
 * @file Test script to test Bastion's successful booting
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');

const configurations = xrequire('./settings/config_example.json');
const credentials = xrequire('./settings/credentials_example.json');
configurations.prefix = [ '!', '*' ];
credentials.token = 'MxjfutRSdOfjOPvxbvTladhT.XTalmy.xStT_kjfuOTladfjOPvxbvtRSdx';

const BASTION = new Tesseract.Client({
  configurations,
  credentials,
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

BASTION.package = xrequire('./package.json');
BASTION.Constants = Tesseract.Constants;
BASTION.colors = Tesseract.Constants.Colors;
BASTION.permissions = Tesseract.Permissions.FLAGS;

// xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Number.prototype');

const WebhookHandler = xrequire('./handlers/webhookHandler.js');
BASTION.webhook = new WebhookHandler(BASTION.credentials.webhooks);
BASTION.log = xrequire('./handlers/logHandler');
BASTION.methods = xrequire('./handlers/methodHandler');

const StringHandler = xrequire('./handlers/stringHandler');
BASTION.i18n = new StringHandler();

const Sequelize = xrequire('sequelize');
BASTION.database = new Sequelize(BASTION.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
BASTION.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  xrequire('./utils/models')(Sequelize, BASTION.database);

  // Load Bastion Events
  xrequire('./handlers/eventHandler')(BASTION);

  // Load Bastion Modules
  const Modules = xrequire('./handlers/moduleHandler');
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
