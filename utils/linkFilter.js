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
  message.client.db.get(`SELECT filterLink, whitelistDomains FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.filterLink === 'true' && !message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) {
      let whitelistDomains = JSON.parse(guild.whitelistDomains),
        links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi),
        matches = [];

      if (links) {
        for (let i = 0; i < whitelistDomains.length; i++) {
          matches[i] = links.filter(url => !message.client.functions.isSameDomain(whitelistDomains[i], url));
        }
        links = message.client.functions.intersect(...matches);

        if (links.length > 0) {
          if (message.deletable) {
            message.delete().catch(e => {
              message.client.log.error(e);
            });
          }

          message.channel.send({
            embed: {
              color: message.client.colors.orange,
              description: `${message.author} you are not allowed to post links here.`
            }
          }).then(msg => {
            msg.delete(5000);
          }).catch(e => {
            message.client.log.error(e);
          });
        }
      }
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
