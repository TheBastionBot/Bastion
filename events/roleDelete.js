/**
 * @file roleDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = role => {
  role.client.emit('serverLog', role.client, role.guild, 'roleDelete', {
    role: role
  });
};
