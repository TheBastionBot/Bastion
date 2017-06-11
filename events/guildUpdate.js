/**
 * @file guildUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldGuild, newGuild) => {
  if (oldGuild.name === newGuild.name) return;

  newGuild.client.emit('serverLog', newGuild.client, newGuild, 'guildUpdate', {
    oldGuild: oldGuild,
    newGuild: newGuild
  });
};
