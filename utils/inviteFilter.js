/**
 * @file inviteFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of Discord server invites in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  message.client.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.filterInvite === 'true' && !message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i.test(message.content)) {
        if (message.deletable) {
          message.delete().catch(e => {
            message.client.log.error(e.stack);
          });
        }

        message.channel.send({
          embed: {
            color: message.client.colors.orange,
            description: `${message.author} you are not allowed to post server invite links here.`
          }
        }).then(msg => {
          msg.delete(5000);
        }).catch(e => {
          message.client.log.error(e);
        });
      }
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
