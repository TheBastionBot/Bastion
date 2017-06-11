/**
 * @file roleUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;

  oldRole.client.emit('serverLog', oldRole.client, oldRole.guild, 'roleUpdate', {
    oldRole: oldRole,
    newRole: newRole
  });
};
