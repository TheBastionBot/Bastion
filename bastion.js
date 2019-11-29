/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const BASTION = new Tesseract.Client({
  settingsDirectory: './settings',
  monitorsDirectory: './monitors',
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (BASTION.shard) process.title = `Bastion-Shard-${BASTION.shard.id}`;
else process.title = 'BastionBot';

BASTION.package = xrequire('./package.json');
BASTION.Constants = Tesseract.Constants;
BASTION.colors = Tesseract.Constants.Colors;
BASTION.permissions = Tesseract.Permissions.FLAGS;

xrequire('./prototypes/Number.prototype');
xrequire('./prototypes/Number');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/Array');
xrequire('./prototypes/Object');

const WebhookHandler = xrequire('./handlers/webhookHandler.js');
BASTION.webhook = new WebhookHandler(BASTION.credentials.webhooks);
BASTION.log = xrequire('./handlers/logHandler');
BASTION.methods = xrequire('./handlers/methodHandler');

BASTION.methods.makeExtractionRequest('/bastion/hq').
  then(hq => (BASTION.hq = hq)).catch(BASTION.log.error);

const StringHandler = xrequire('./handlers/stringHandler');
BASTION.i18n = new StringHandler();

const Sequelize = xrequire('sequelize');
BASTION.database = new Sequelize(BASTION.credentials.database.URI, {
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
  /* eslint-disable no-console */
  console.warn('\n[unhandledRejection]');
  console.warn(rejection);
  console.warn('[/unhandledRejection]\n');
  /* eslint-enable no-console */
});
