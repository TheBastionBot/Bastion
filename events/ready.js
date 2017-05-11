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

const SQL = require('sqlite');
const COLOR = require('chalk');
SQL.open('./data/Bastion.sqlite');

module.exports = Bastion => {
  Bastion.user.setStatus(Bastion.config.status);
  Bastion.user.setGame(Bastion.config.game);

  SQL.run('CREATE TABLE IF NOT EXISTS guildSettings' +
          '(guildID TEXT NOT NULL UNIQUE,' +
          'greet TEXT NOT NULL DEFAULT \'false\',' +
          'greetChannelID TEXT,' +
          'greetMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
          'greetTimeout INTEGER NOT NULL DEFAULT 30,' +
          'greetDM TEXT NOT NULL DEFAULT \'false\',' +
          'greetDMMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
          'farewell TEXT NOT NULL DEFAULT \'false\',' +
          'farewellChannelID TEXT UNIQUE,' +
          'farewellMessage TEXT NOT NULL DEFAULT \'We hope you enjoyed your stay here!\',' +
          'farewellTimeout INTEGER NOT NULL DEFAULT 15,' +
          'log TEXT NOT NULL DEFAULT \'false\',' +
          'logChannelID TEXT UNIQUE,' +
          'musicTextChannelID TEXT UNIQUE,' +
          'musicVoiceChannelID TEXT UNIQUE,' +
          'filterInvite TEXT NOT NULL DEFAULT \'false\',' +
          'filterLink TEXT NOT NULL DEFAULT \'false\',' +
          'chat TEXT NOT NULL DEFAULT \'false\',' +
          'levelUpMessage TEXT NOT NULL DEFAULT \'true\',' +
          'selfAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'autoAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'modLog TEXT NOT NULL DEFAULT \'false\',' +
          'modLogChannelID TEXT UNIQUE,' +
          'modCaseNo TEXT NOT NULL DEFAULT \'1\',' +
          'PRIMARY KEY(guildID))').then(() => {
    let bastionGuilds = Bastion.guilds.map(g => g.id);

    SQL.all('SELECT guildID from guildSettings').then(row => {
      row = row.map(r => r.guildID);

      for (let i = 0; i < bastionGuilds.length; i++) {
        let found = false;
        for (let j = 0; j < row.length; j++) {
          if (bastionGuilds[i] === row[j]){
            found = true;
            break;
          }
        }
        if (found === false) {
          SQL.run('INSERT INTO guildSettings (guildID) VALUES (?)', [bastionGuilds[i]]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
      }

      for (let i = 0; i < row.length; i++) {
        let found = false;
        for (let j = 0; j < bastionGuilds.length; j++) {
          if (row[i] === bastionGuilds[j]){
            found = true;
            break;
          }
        }
        if (found === false) {
          SQL.run(`DELETE FROM guildSettings WHERE guildID=${row[i]}`).catch(e => {
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

  SQL.run('CREATE TABLE IF NOT EXISTS blacklistedUsers' +
          '(userID TEXT NOT NULL UNIQUE,' +
          'PRIMARY KEY(userID))').catch(e => {
    Bastion.log.error(e.stack);
  });

  SQL.run('CREATE TABLE IF NOT EXISTS profiles' +
          '(userID TEXT NOT NULL UNIQUE,' +
          'bastionCurrencies INTEGER DEFAULT 0,' +
          'xp INTEGER DEFAULT 0,' +
          'level INTEGER DEFAULT 0,' +
          'PRIMARY KEY(userID))').catch(e => {
    Bastion.log.error(e.stack);
  });

  SQL.run('CREATE TABLE IF NOT EXISTS triggers' +
          '(trigger TEXT NOT NULL,' +
          'response TEXT NOT NULL)').catch(e => {
    Bastion.log.error(e.stack);
  });

  SQL.run('CREATE TABLE IF NOT EXISTS todo' +
          '(ownerID TEXT NOT NULL UNIQUE,' +
          'list TEXT NOT NULL DEFAULT \'[]\')').catch(e => {
    Bastion.log.error(e.stack);
  });

  console.log('\n');
  console.log(COLOR.green(`[Author] `) + `${Bastion.package.author}`);
  console.log(COLOR.green(`[Author URL] `) + `${Bastion.package.authorUrl}`);
  console.log(COLOR.green(`[Library] `) + `${Bastion.package.library}`);
  console.log(COLOR.green(`[Bot] `) + `Bastion v${Bastion.package.version}`);
  console.log(COLOR.green(`[Bot ID] `) + `${Bastion.credentials.botId}`);
  console.log(COLOR.green(`[Owner IDs] `) + `${Bastion.credentials.ownerId.join(', ')}`);
  console.log(COLOR.green(`[Servers] `) + `${Bastion.guilds.size}`);
  console.log(COLOR.green(`[Prefix] `) + `${Bastion.config.prefix}`);
  console.log(COLOR.cyan(`\n[${Bastion.user.username}]: `) + `I'm ready to roll! o7`);
};
