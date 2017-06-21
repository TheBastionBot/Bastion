/**
 * @file message event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const credentialsFilter = require('../utils/credentialsFilter');
const wordFilter = require('../utils/wordFilter');
const linkFilter = require('../utils/linkFilter');
const inviteFilter = require('../utils/inviteFilter');
const handleTrigger = require('../handlers/triggerHandler');
const handleUserLevel = require('../handlers/levelHandler');
const handleCommand = require('../handlers/commandHandler');
const handleConversation = require('../handlers/conversationHandler');

module.exports = message => {
  /**
   * Filter Bastion's credentials from the message
   */
  credentialsFilter(message);

  if (message.author.bot) return;

  if (message.guild) {
    /**
     * Filter specific words from the message
     */
    wordFilter(message);

    /**
     * Filter links from the message
     */
    linkFilter(message);

    /**
     * Filter Discord server invites from the message
     */
    inviteFilter(message);

    /**
     * Check if the message contains a trigger and respond to it
     */
    handleTrigger(message);

    message.client.db.all('SELECT userID FROM blacklistedUsers').then(users => {
      if (users.map(u => u.userID).includes(message.author.id)) return;

      /**
       * Increase experience and level up user
       */
      handleUserLevel(message);

      /**
       * Handles Bastion's commands
       */
      handleCommand(message);

      if (message.content.startsWith(`<@${message.client.credentials.botId}>`) || message.content.startsWith(`<@!${message.client.credentials.botId}>`)) {
        /**
         * Handles conversations with Bastion
         */
        handleConversation(message);
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }
  else {
    if (message.content.startsWith(`${message.client.config.prefix}h`) || message.content.startsWith(`${message.client.config.prefix}help`)) {
      return message.channel.send({
        embed: {
          color: message.client.colors.blue,
          title: 'Bastion Discord BOT',
          url: 'https://bastion.js.org',
          description: 'Join [**Bastion Support Server**](https://discord.gg/fzx8fkt) for testing the commands or any help you need with the bot or maybe just for fun.',
          fields: [
            {
              name: 'Support Server Invite Link',
              value: 'https://discord.gg/fzx8fkt'
            },
            {
              name: 'BOT Invite Link',
              value: `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958463`
            }
          ],
          thumbnail: {
            url: message.client.user.displayAvatarURL
          },
          footer: {
            text: 'Copyright © 2017 Sankarsan Kampa'
          }
        }
      }).catch(e => {
        message.client.log.error(e.stack);
      });
    }
  }
};
