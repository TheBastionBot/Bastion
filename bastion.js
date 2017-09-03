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

BASTION.package = require('./package.json');
BASTION.credentials = require('./settings/credentials.json');
BASTION.config = require('./settings/config.json');
BASTION.colors = Discord.Constants.Colors;

let languages = [
  'english',
  'spanish'
];
let language = 'english';
if (languages.includes(BASTION.config.language)) {
  language = BASTION.config.language;
}
process.env.LANG = language;

// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

BASTION.log = require('./handlers/logHandler');
BASTION.functions = require('./handlers/functionHandler');
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
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
