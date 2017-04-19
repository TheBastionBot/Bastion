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

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

module.exports = guild => {
  sql.run("CREATE TABLE IF NOT EXISTS guildSettings (guildID TEXT NOT NULL UNIQUE, greet TEXT NOT NULL DEFAULT 'false', greetChannelID TEXT, greetMessage TEXT NOT NULL DEFAULT 'Welcome to $server.', greetTimeout INTEGER NOT NULL DEFAULT 30, farewell TEXT NOT NULL DEFAULT 'false', farewellChannelID TEXT UNIQUE, farewellMessage TEXT NOT NULL DEFAULT 'We hope you enjoyed your stay here!', farewellTimeout INTEGER NOT NULL DEFAULT 15, log TEXT NOT NULL DEFAULT 'false', logChannelID TEXT UNIQUE, musicTextChannelID TEXT UNIQUE, musicVoiceChannelID TEXT UNIQUE, filterInvite TEXT NOT NULL DEFAULT 'false', chat TEXT NOT NULL DEFAULT 'false', levelUpMessage TEXT NOT NULL DEFAULT 'true', selfAssignableRoles TEXT NOT NULL DEFAULT '[]', autoAssignableRoles TEXT NOT NULL DEFAULT '[]', modLog TEXT NOT NULL DEFAULT 'false', modLogChannelID TEXT UNIQUE, modCaseNo TEXT NOT NULL DEFAULT '1', PRIMARY KEY(guildID))").then(() => {
    sql.run('INSERT OR IGNORE INTO guildSettings (guildID) VALUES (?)', [guild.id]).catch(e => {
      guild.client.log.error(e.stack);
    });
  }).catch(e => {
    guild.client.log.error(e.stack);
  });
};
