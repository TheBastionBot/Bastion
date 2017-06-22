/**
 * @file linkFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of links in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  message.client.db.get(`SELECT filterLink FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.filterLink === 'true' && !message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/i.test(message.content)) {
        if (message.deletable) {
          message.delete().catch(e => {
            message.client.log.error(e.stack);
          });
        }
        message.channel.send({
          embed: {
            color: message.client.colors.orange,
            description: `${message.author} you are not allowed to post links here.`
          }
        }).catch(e => {
          message.client.log.error(e);
        });
      }
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
