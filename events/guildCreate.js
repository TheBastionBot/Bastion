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
    'greetMessage BLOB,' +
    'greetTimeout INTEGER NOT NULL DEFAULT 30,' +
    'greetPrivate INTEGER NOT NULL DEFAULT 0,' +
    'greetPrivateMessage BLOB,' +
    'farewell TEXT UNIQUE,' +
    'farewellMessage BLOB,' +
    'farewellTimeout INTEGER NOT NULL DEFAULT 15,' +
    'log TEXT UNIQUE,' +
    'musicTextChannel TEXT UNIQUE,' +
    'musicVoiceChannel TEXT UNIQUE,' +
    'musicMasterRole TEXT UNIQUE,' +
    'filterInvite INTEGER NOT NULL DEFAULT 0,' +
    'filterLink INTEGER NOT NULL DEFAULT 0,' +
    'whitelistDomains TEXT NOT NULL DEFAULT \'[]\',' +
    'filterWord INTEGER NOT NULL DEFAULT 0,' +
    'filteredWords TEXT,' +
    'announcementChannel TEXT,' +
    'chat INTEGER NOT NULL DEFAULT 0,' +
    'levelUpMessage INTEGER NOT NULL DEFAULT 0,' +
    'selfAssignableRoles TEXT,' +
    'autoAssignableRoles TEXT' +
    'streamerRole TEXT,' +
    'warnAction TEXT,' +
    'ignoredChannels TEXT,' +
    'ignoredRoles TEXT,' +
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
