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
const handleDirectMessage = require('../handlers/directMessageHandler');

module.exports = message => {
  /**
   * Filter Bastion's credentials from the message
   */
  credentialsFilter(message);

  /**
   * If the message author is a bot, ignore it.
   */
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

      /**
       * Check if the message starts with mentioning Bastion
       */
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
    /**
     * Handles direct messages sent to Bastion
     */
    handleDirectMessage(message);
  }
};
