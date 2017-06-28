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
BASTION.colors = require('../settings/colors.json');

let languages = [
  'english'
];
let language = 'english';
if (languages.includes(BASTION.config.language)) {
  language = BASTION.config.language;
}
process.env.LANG = language;

BASTION.functions = {};
BASTION.commands = new Discord.Collection();
BASTION.aliases = new Discord.Collection();

try {
  require('../utils/String.prototype');
  // Will use after updating to `discord.js v11.2.0+` as `discord.js v11.1.0` has problems with send() when using array prototypes
  // require('../utils/Array.prototype');

  require('../handlers/functionHandler')(BASTION);
  require('../handlers/logHandler')(BASTION);
  require('../handlers/eventHandler')(BASTION);
  require('../handlers/moduleHandler')(BASTION);
}
catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}
