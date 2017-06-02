/**
 * @file messageUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldMessage, newMessage) => {
  if (newMessage.content.includes(newMessage.client.token)) {
    if (newMessage.deletable) {
      newMessage.delete().catch(e => {
        newMessage.client.log.error(e.stack);
      });
    }
    newMessage.client.fetchApplication().then(app => {
      newMessage.client.users.get(app.owner.id).send({
        embed: {
          color: newMessage.client.colors.red,
          title: 'ATTENTION!',
          description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
          fields: [
            {
              name: 'Responsible user',
              value: `${newMessage.author.tag} - ${newMessage.author.id}`
            }
          ]
        }
      }).catch(e => {
        newMessage.client.log.error(e.stack);
      });
    }).catch(e => {
      newMessage.client.log.error(e.stack);
    });
  }

  if (!oldMessage.guild) return;
  if (newMessage.author.bot) return;

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
