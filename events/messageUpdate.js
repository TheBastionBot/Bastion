/**
 * @file messageUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const credentialsFilter = require('../utils/credentialsFilter');
const wordFilter = require('../utils/wordFilter');
const linkFilter = require('../utils/linkFilter');

module.exports = (oldMessage, newMessage) => {
  /**
   * Filter Bastion's credentials from the message
   */
  credentialsFilter(newMessage);

  if (!oldMessage.guild) return;
  if (newMessage.author.bot) return;

  /**
   * Filter specific words from the message
   */
  wordFilter(newMessage);

  /**
   * Filter links from the message
   */
  linkFilter(newMessage);

  oldMessage.client.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${newMessage.guild.id}`).then(guild => {
    if (guild.filterInvite === 'true' && !newMessage.guild.members.get(newMessage.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite\/)\/?([a-z0-9-.]+)?/i.test(newMessage.content)) {
        if (newMessage.deletable) {
          newMessage.delete().catch(e => {
            newMessage.client.log.error(e.stack);
          });
        }
      }
    }
  }).catch(e => {
    newMessage.client.log.error(e.stack);
  });
};
