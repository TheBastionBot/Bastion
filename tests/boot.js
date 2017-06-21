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
BASTION.functions = {};
BASTION.commands = new Discord.Collection();
BASTION.aliases = new Discord.Collection();

try {
  require('../handlers/functionHandler')(BASTION);
  require('../handlers/logHandler')(BASTION);
  require('../handlers/eventHandler')(BASTION);
  require('../handlers/moduleHandler')(BASTION);

  // Will use after updating to `discord.js v11.2.0+` as `discord.js v11.1.0` has problems with send() when using array prototypes
  // require('./functions/Array.prototype');}
}
catch (e) {
  BASTION.log.error(e);
}
