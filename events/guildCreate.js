/**
 * @file guildCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = guild => {
  guild.client.db.run('INSERT OR IGNORE INTO guildSettings (guildID) VALUES (?)', [ guild.id ]).catch(e => {
    guild.client.log.error(e);
  });

  /**
   * bastion join/leave log events, if enabled
   * @fires bastionLog
   */
  guild.client.emit('bastionLog', guild.client, 'guildCreate', guild);
};
