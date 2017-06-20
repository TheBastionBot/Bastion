/**
 * @file messageUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const credentialsFilter = require('../utils/credentialsFilter');

module.exports = (oldMessage, newMessage) => {
  /**
   * Filter Bastion's credentials from message
   */
  credentialsFilter(newMessage);

  if (!oldMessage.guild) return;
  if (newMessage.author.bot) return;

  oldMessage.client.db.get(`SELECT filterWord, filteredWords FROM guildSettings WHERE guildID=${newMessage.guild.id}`).then(guild => {
    if (guild.filterWord === 'true' && !newMessage.guild.members.get(newMessage.author.id).hasPermission('ADMINISTRATOR')) {
      let filteredWords = JSON.parse(guild.filteredWords);
      for (let i = 0; i < filteredWords.length; i++) {
        if (newMessage.content.toLowerCase().includes(filteredWords[i].toLowerCase())) {
          if (newMessage.deletable) {
            return newMessage.delete().catch(e => {
              newMessage.client.log.error(e.stack);
            });
          }
        }
      }
    }
  }).catch(e => {
    newMessage.client.log.error(e.stack);
  });

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

  oldMessage.client.db.get(`SELECT filterLink FROM guildSettings WHERE guildID=${newMessage.guild.id}`).then(guild => {
    if (guild.filterLink === 'true' && !newMessage.guild.members.get(newMessage.author.id).hasPermission('ADMINISTRATOR')) {
      if (/(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/i.test(newMessage.content)) {
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
