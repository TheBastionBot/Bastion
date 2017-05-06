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
const chalk = require('chalk');
sql.open('./data/Bastion.sqlite');

module.exports = Bastion => {
  Bastion.user.setStatus(Bastion.config.status);
  Bastion.user.setGame(Bastion.config.game);

  sql.run("CREATE TABLE IF NOT EXISTS guildSettings (guildID TEXT NOT NULL UNIQUE, greet TEXT NOT NULL DEFAULT 'false', greetChannelID TEXT, greetMessage TEXT NOT NULL DEFAULT 'Welcome to $server.', greetTimeout INTEGER NOT NULL DEFAULT 30, farewell TEXT NOT NULL DEFAULT 'false', farewellChannelID TEXT UNIQUE, farewellMessage TEXT NOT NULL DEFAULT 'We hope you enjoyed your stay here!', farewellTimeout INTEGER NOT NULL DEFAULT 15, log TEXT NOT NULL DEFAULT 'false', logChannelID TEXT UNIQUE, musicTextChannelID TEXT UNIQUE, musicVoiceChannelID TEXT UNIQUE, filterInvite TEXT NOT NULL DEFAULT 'false', chat TEXT NOT NULL DEFAULT 'false', levelUpMessage TEXT NOT NULL DEFAULT 'true', selfAssignableRoles TEXT NOT NULL DEFAULT '[]', autoAssignableRoles TEXT NOT NULL DEFAULT '[]', modLog TEXT NOT NULL DEFAULT 'false', modLogChannelID TEXT UNIQUE, modCaseNo TEXT NOT NULL DEFAULT '1', PRIMARY KEY(guildID))").then(() => {
    let BastionGuilds = Bastion.guilds.map(g => g.id);
    sql.all('SELECT guildID from guildSettings').then(row => {
      row = row.map(r => r.guildID);
      for (let i = 0; i < BastionGuilds.length; i++) {
        let found = false;
        for (let j = 0; j < row.length; j++) {
          if (BastionGuilds[i] === row[j]){
            found = true;
            break;
          }
        }
        if (found === false) {
          sql.run('INSERT INTO guildSettings (guildID) VALUES (?)', [BastionGuilds[i]]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
      }
      for (let i = 0; i < row.length; i++) {
        let found = false;
        for (let j = 0; j < BastionGuilds.length; j++) {
          if (row[i] === BastionGuilds[j]){
            found = true;
            break;
          }
        }
        if (found === false) {
          sql.run(`DELETE FROM guildSettings WHERE guildID=${row[i]}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
  sql.run('CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))').catch(e => {
    Bastion.log.error(e.stack);
  });
  sql.run('CREATE TABLE IF NOT EXISTS profiles (userID TEXT NOT NULL UNIQUE, bastionCurrencies INTEGER DEFAULT 0, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 0, PRIMARY KEY(userID))').catch(e => {
    Bastion.log.error(e.stack);
  });
  sql.run('CREATE TABLE IF NOT EXISTS triggers (trigger TEXT NOT NULL, response TEXT NOT NULL)').catch(e => {
    Bastion.log.error(e.stack);
  });
  sql.run("CREATE TABLE IF NOT EXISTS todo (ownerID TEXT NOT NULL UNIQUE, list TEXT NOT NULL DEFAULT '[]')").catch(e => {
    Bastion.log.error(e.stack);
  });

  console.log('\n');
  console.log(chalk.green(`[Author] `) + `${Bastion.package.author}`);
  console.log(chalk.green(`[Author URL] `) + `${Bastion.package.authorUrl}`);
  console.log(chalk.green(`[Library] `) + `${Bastion.package.library}`);
  console.log(chalk.green(`[Bot] `) + `Bastion v${Bastion.package.version}`);
  console.log(chalk.green(`[Bot ID] `) + `${Bastion.credentials.botId}`);
  console.log(chalk.green(`[Owner IDs] `) + `${Bastion.credentials.ownerId.join(', ')}`);
  console.log(chalk.green(`[Servers] `) + `${Bastion.guilds.size}`);
  console.log(chalk.green(`[Prefix] `) + `${Bastion.config.prefix}`);
  console.log(chalk.cyan(`\n[${Bastion.user.username}]: `) + `I'm ready to roll! o7`);
};
