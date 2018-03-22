/**
 * @file bastionMissingPermissions event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (permissions, message) => {
  if (!message) return;

  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      description: message.client.strings.error(message.guild.language, 'bastionMissingPermissions', true, permissions.replace('_', ' '))
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
