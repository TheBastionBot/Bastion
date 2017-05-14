/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
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
BASTION.commands = new Discord.Collection();
BASTION.aliases = new Discord.Collection();

try {
  require('../handlers/logHandler')(BASTION);
  require('../handlers/eventHandler')(BASTION);
  require('../handlers/moduleHandler')(BASTION);

  // Will use after updating to `discord.js v11.2.0+` as `discord.js v11.1.0` has problems with send() when using array prototypes
  // require('./functions/Array.prototype');}
} catch (e) {
  BASTION.log.error(e);
}
