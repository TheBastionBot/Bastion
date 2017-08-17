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

/**
 * Initial configurations
 */
BASTION.package = require('./package.json');
BASTION.credentials = require('./settings/credentials.json');
BASTION.config = require('./settings/config.json');
BASTION.colors = require('./settings/colors.json');

let languages = [
  'english'
];
let language = 'english';
if (languages.includes(BASTION.config.language)) {
  language = BASTION.config.language;
}
process.env.LANG = language;

BASTION.log = require('./handlers/logHandler');
BASTION.functions = require('./handlers/functionHandler');
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
});

/**
 * Load base class prototypes
 */
// Will use after updating to `discord.js v11.2.0+` as `discord.js v11.1.0` has problems with send() when using array prototypes
// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

/**
 * Event handler
 */
require('./handlers/eventHandler')(BASTION);

const Modules = require('./handlers/moduleHandler');
BASTION.commands = Modules.commands;
BASTION.aliases = Modules.aliases;

/**
 * Scheduled Commands handler
 */
require('./handlers/scheduledCommandHandler')(BASTION);

/**
 * Log Bastion in as a Discord client.
 */
BASTION.login(BASTION.credentials.token).catch(e => {
  BASTION.log.error(e.toString());
  process.exit(1);
});

/**
 * Handle unhandled rejections
 */
process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn('\n[unhandledRejection]\n\n', rejection, '\n\n[/unhandledRejection]\n');
});
