/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = Bastion => {
  Bastion.user.setStatus(Bastion.config.status);
  Bastion.user.setGame(Bastion.config.game);

  Bastion.db.run('CREATE TABLE IF NOT EXISTS guildSettings' +
          '(guildID TEXT NOT NULL UNIQUE,' +
          `prefix TEXT NOT NULL DEFAULT '${Bastion.config.prefix}',` +
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
          'musicMasterRoleID TEXT UNIQUE,' +
          'filterInvite TEXT NOT NULL DEFAULT \'false\',' +
          'filterLink TEXT NOT NULL DEFAULT \'false\',' +
          'whitelistDomains TEXT NOT NULL DEFAULT \'[]\',' +
          'filterWord TEXT NOT NULL DEFAULT \'false\',' +
          'filteredWords TEXT NOT NULL DEFAULT \'[]\',' +
          'chat TEXT NOT NULL DEFAULT \'false\',' +
          'levelUpMessage TEXT NOT NULL DEFAULT \'false\',' +
          'selfAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'autoAssignableRoles TEXT NOT NULL DEFAULT \'[]\',' +
          'modLog TEXT NOT NULL DEFAULT \'false\',' +
          'modLogChannelID TEXT UNIQUE,' +
          'modCaseNo TEXT NOT NULL DEFAULT \'1\',' +
          'PRIMARY KEY(guildID))').then(() => {
            let bastionGuilds = Bastion.guilds.map(g => g.id);

            Bastion.db.all('SELECT guildID from guildSettings').then(row => {
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
                  Bastion.db.run('INSERT INTO guildSettings (guildID) VALUES (?)', [ bastionGuilds[i] ]).catch(e => {
                    Bastion.log.error(e);
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
                  Bastion.db.run(`DELETE FROM guildSettings WHERE guildID=${row[i]}`).catch(e => {
                    Bastion.log.error(e);
                  });
                }
              }
            }).catch(e => {
              Bastion.log.error(e);
            });
          }).catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS blacklistedUsers' +
          '(userID TEXT NOT NULL UNIQUE,' +
          'PRIMARY KEY(userID))').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS profiles' +
          '(userID TEXT NOT NULL UNIQUE,' +
          'bastionCurrencies INTEGER DEFAULT 0,' +
          'xp INTEGER DEFAULT 0,' +
          'level INTEGER DEFAULT 0,' +
          'bio TEXT,' +
          'PRIMARY KEY(userID))').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS triggers' +
          '(trigger TEXT NOT NULL,' +
          'response TEXT NOT NULL)').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS todo' +
          '(ownerID TEXT NOT NULL UNIQUE,' +
          'list TEXT NOT NULL DEFAULT \'[]\')').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS bastionSettings' +
          '(log TEXT NOT NULL DEFAULT \'false\',' +
          'logChannelID TEXT UNIQUE)').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS scheduledCommands' +
          '(cronExp TEXT NOT NULL,' +
          'command TEXT NOT NULL,' +
          'channelID TEXT NOT NULL,' +
          'messageID TEXT NOT NULL,' +
          'arguments TEXT)').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.db.run('CREATE TABLE IF NOT EXISTS transactions' +
          '(userID TEXT NOT NULL,' +
          'type TEXT NOT NULL,' +
          'amount INTEGER NOT NULL)').catch(e => {
            Bastion.log.error(e);
          });

  Bastion.log.console('\n');
  Bastion.log.console(COLOR.green('[Author] ') + Bastion.package.author);
  Bastion.log.console(COLOR.green('[Author URL] ') + Bastion.package.authorUrl);
  Bastion.log.console(COLOR.green('[Library] ') + Bastion.package.library);
  Bastion.log.console(`${COLOR.green('[Bot]')} Bastion v${Bastion.package.version}`);
  Bastion.log.console(COLOR.green('[Bot ID] ') + Bastion.credentials.botId);
  Bastion.log.console(COLOR.green('[Owner IDs] ') + Bastion.credentials.ownerId.join(', '));
  Bastion.log.console(COLOR.green('[Servers] ') + Bastion.guilds.size);
  Bastion.log.console(COLOR.green('[Prefix] ') + Bastion.config.prefix);
  Bastion.log.console(`${COLOR.cyan(`\n[${Bastion.user.username}]:`)} I'm ready to roll! o7`);
};
