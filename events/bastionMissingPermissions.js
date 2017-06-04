/**
 * @file bastionMissingPermissions event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (permissions, message) => {
  if (message) {
    message.channel.send({
      embed: {
        color: message.client.colors.red,
        description: `I need **${permissions.replace('_', ' ')}** permission to run this command.`
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }
};
