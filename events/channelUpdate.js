/**
 * @file channelUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (oldChannel.name === newChannel.name) return;

  newChannel.client.emit('serverLog', newChannel.client, newChannel.guild, 'channelUpdate', {
    oldChannel: oldChannel,
    newChannel: newChannel
  });
};
