/**
 * @file guildBanAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (guild, user) => {
  guild.client.emit('serverLog', guild.client, guild, 'guildBanAdd', {
    guild: guild,
    user: user
  });
};
