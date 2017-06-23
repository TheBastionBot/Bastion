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
 * Initial configuration
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

BASTION.commands = new Discord.Collection();
BASTION.aliases = new Discord.Collection();
BASTION.functions = {};
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite');

/**
* Function handler
*/
require('./handlers/functionHandler')(BASTION);
/**
 * Log handler
 */
require('./handlers/logHandler')(BASTION);
/**
 * Event handler
 */
require('./handlers/eventHandler')(BASTION);
/**
 * Module handler
 */
require('./handlers/moduleHandler')(BASTION);

// Will use after updating to `discord.js v11.2.0+` as `discord.js v11.1.0` has problems with send() when using array prototypes
// require('./utils/Array.prototype');

/**
 * Log Bastion in as a Discord client.
 */
BASTION.login(BASTION.credentials.token).catch(e => {
  BASTION.log.error(e.stack);
});

/**
 * Handle unhandled rejections
 */
process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn('\n[unhandledRejection]\n\n', rejection, '\n\n[/unhandledRejection]\n');
});
