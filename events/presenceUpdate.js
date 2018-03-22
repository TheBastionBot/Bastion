/**
 * @file presenceUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (oldMember, newMember) => {
  try {
    if (newMember.roles.size < 2) return;
    if (newMember.user.presence.status === 'offline') return;
    if (oldMember.frozenPresence.game && newMember.user.presence.game && oldMember.frozenPresence.game.type === newMember.user.presence.game.type) return;

    let guildSettings = await newMember.client.db.get(`SELECT streamerRole FROM guildSettings WHERE guildID=${newMember.guild.id}`);
    if (!guildSettings || !guildSettings.streamerRole) return;

    let streamerRole = newMember.guild.roles.get(guildSettings.streamerRole);
    if (!streamerRole) return;

    if (!newMember.user.presence.game || newMember.user.presence.game.type !== 1) {
      if (newMember.roles.has(streamerRole.id)) {
        await newMember.removeRole(streamerRole, 'Stopped streaming').catch(() => {});
      }
      return;
    }

    await newMember.addRole(streamerRole, 'Started streaming').catch(() => {});
  }
  catch (e) {
    newMember.client.log.error(e);
  }
};
