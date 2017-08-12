/**
 * @file guildCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = guild => {
  guild.client.db.run('CREATE TABLE IF NOT EXISTS guildSettings' +
    '(guildID TEXT NOT NULL UNIQUE,' +
    `prefix TEXT NOT NULL DEFAULT '${guild.client.config.prefix}',` +
    'greet TEXT UNIQUE,' +
    'greetMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
    'greetTimeout INTEGER NOT NULL DEFAULT 30,' +
    'greetDM TEXT NOT NULL DEFAULT \'false\',' +
    'greetDMMessage TEXT NOT NULL DEFAULT \'Welcome to $server.\',' +
    'farewell TEXT UNIQUE,' +
    'farewellMessage TEXT NOT NULL DEFAULT \'We hope you enjoyed your stay here!\',' +
    'farewellTimeout INTEGER NOT NULL DEFAULT 15,' +
    'log TEXT UNIQUE,' +
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
    'modLog TEXT UNIQUE,' +
    'modCaseNo TEXT NOT NULL DEFAULT \'1\',' +
    'PRIMARY KEY(guildID))').then(() => {
      guild.client.db.run('INSERT OR IGNORE INTO guildSettings (guildID) VALUES (?)', [ guild.id ]).catch(e => {
        guild.client.log.error(e);
      });
    }).catch(e => {
      guild.client.log.error(e);
    });

  /**
   * bastion join/leave log events, if enabled
   * @fires bastionLog
   */
  guild.client.emit('bastionLog', guild.client, 'guildCreate', guild);
};
