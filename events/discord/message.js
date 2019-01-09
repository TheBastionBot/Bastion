/**
 * @file message event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const credentialsFilter = xrequire('./filters/credentialsFilter');
const emojiFilter = xrequire('./filters/emojiFilter');
const wordFilter = xrequire('./filters/wordFilter');
const linkFilter = xrequire('./filters/linkFilter');
const inviteFilter = xrequire('./filters/inviteFilter');
const mentionSpamFilter = xrequire('./filters/mentionSpamFilter');
const handleTrigger = xrequire('./handlers/triggerHandler');
const handleUserLevel = xrequire('./handlers/levelHandler');
const handleCommand = xrequire('./handlers/commandHandler');
const handleConversation = xrequire('./handlers/conversationHandler');
const handleDirectMessage = xrequire('./handlers/directMessageHandler');
let recentLevelUps = [];

module.exports = async message => {
  try {
    message.client.monitors.exec(__filename.slice(__dirname.length + 1, -3), message);

    /**
     * Filter Bastion's credentials from the message
     */
    if (await credentialsFilter(message)) return;

    /**
     * If the message author is a bot, ignore it.
     */
    if (message.author.bot) return;

    if (message.guild) {
      /**
       * Filter specific words from the message
       */
      if (await wordFilter(message)) return;

      /**
       * Filter links from the message
       */
      if (await linkFilter(message)) return;

      /**
       * Filter Discord server invites from the message
       */
      if (await inviteFilter(message)) return;

      /**
       * Moderate mention spams in the message
       */
      if (await mentionSpamFilter(message)) return;

      /**
       * Filter emoji spams in the message
       */
      if (await emojiFilter(message)) return;

      /**
       * Check if the message contains a trigger and respond to it
       */
      handleTrigger(message);

      /**
       * Check if the message author is blacklisted
       */
      let settingsModel = await message.client.database.models.settings.findOne({
        attributes: [ 'blacklistedUsers' ],
        where: {
          botID: message.client.user.id
        }
      });

      if (settingsModel && settingsModel.dataValues.blacklistedUsers) {
        if (settingsModel.dataValues.blacklistedUsers.includes(message.author.id)) return;
      }

      /**
       * Cooldown for experience points, to prevent spam
       */
      if (!recentLevelUps.includes(message.author.id)) {
        recentLevelUps.push(message.author.id);
        setTimeout(function () {
          recentLevelUps.splice(recentLevelUps.indexOf(message.author.id), 1);
        }, 20 * 1000);
        /**
         * Increase experience and level up user
         */
        handleUserLevel(message);
      }

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

      /**
       * Set message for voting, if it's a voting channel.
       */
      let textChannelModel = await message.client.database.models.textChannel.findOne({
        attributes: [ 'votingChannel' ],
        where: {
          channelID: message.channel.id,
          guildID: message.guild.id
        }
      });
      if (textChannelModel && textChannelModel.dataValues.votingChannel) {
        // Add reactions for voting
        await message.react('👍');
        await message.react('👎');
      }


      /**
       * AFK Mode
       */
      if (message.guild.usersAFK) {
        // Delete message author from usersAFK if he's back.
        if (message.guild.usersAFK.includes(message.author.id)) {
          message.guild.usersAFK.splice(message.guild.usersAFK.indexOf(message.author.id), 1);
        }

        let usersAFK = message.mentions.users.filter(user => message.guild.usersAFK.includes(user.id) && message.channel.permissionsFor(user).has('MANAGE_GUILD'));
        for (let user of usersAFK) {
          user = user[1];
          message.channel.send(`**${user.tag}** is currently away from keyboard. ${user.username} will get back to you later.`).catch(() => {});
        }
      }
    }
    else {
      /**
       * Handles direct messages sent to Bastion
       */
      handleDirectMessage(message);
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
