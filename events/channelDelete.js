/**
 * @file channelDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = channel => {
  if (!channel.guild) return;

  channel.client.emit('serverLog', channel.client, channel.guild, 'channelDelete', {
    channel: channel
  });
};
