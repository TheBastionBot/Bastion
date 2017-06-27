/**
 * @file guildDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = guild => {
  guild.client.db.run(`DELETE FROM guildSettings WHERE guildID=${guild.id}`).catch(e => {
    guild.client.log.error(e);
  });

  /**
   * bastion join/leave log events, if enabled
   * @fires bastionLog
   */
  guild.client.emit('bastionLog', guild.client, 'guildDelete', guild);
};
