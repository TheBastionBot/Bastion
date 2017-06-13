/**
 * @file guildBanRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (guild, user) => {
  guild.client.emit('serverLog', guild.client, guild, 'guildBanRemove', {
    guild: guild,
    user: user
  });
};
