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
const Bastion = new Discord.Client({
  disabledEvents: [
    'GUILD_MEMBERS_CHUNK',
    'CHANNEL_PINS_UPDATE',
    'USER_NOTE_UPDATE',
    // 'VOICE_STATE_UPDATE',
    'TYPING_START',
    // 'VOICE_SERVER_UPDATE',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

Bastion.package = require('./package.json');
Bastion.credentials = require('./settings/credentials.json');
Bastion.config = require('./settings/config.json');
Bastion.colors = require('./data/colors.json');
Bastion.commands = new Discord.Collection();
Bastion.aliases = new Discord.Collection();

require('./handlers/logHandler')(Bastion);
require('./handlers/eventHandler')(Bastion);
require('./handlers/moduleHandler')(Bastion);

Bastion.login(Bastion.credentials.token);

process.on('unhandledRejection', (reason, p) => {
  console.log('\n[ Unhandled Rejection ] at:\nPromise:\n', p, '\n\nReason:\n', reason, '\n');
});
