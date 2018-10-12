/**
 * @file message event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const credentialsFilter = xrequire('./filters/credentialsFilter');
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
let recentUsers = {};

module.exports = async message => {
  try {
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

      let guildModel = await message.client.database.models.guild.findOne({
        attributes: [ 'slowMode' ],
        where: {
          guildID: message.guild.id
        },
        include: [
          {
            model: message.client.database.models.textChannel,
            attributes: [ 'channelID', 'ignoreSlowMode' ]
          },
          {
            model: message.client.database.models.role,
            attributes: [ 'roleID', 'ignoreSlowMode' ]
          }
        ]
      });

      let slowModeIgnoredChannels = guildModel.textChannels.length && guildModel.textChannels.filter(model => model.dataValues.ignoreSlowMode).map(model => model.dataValues.channelID);
      let slowModeIgnoredRoles = guildModel.roles.length && guildModel.roles.filter(model => model.dataValues.ignoreSlowMode).map(model => model.dataValues.roleID);

      if (!slowModeIgnoredChannels) slowModeIgnoredChannels = [];
      if (!slowModeIgnoredRoles) slowModeIgnoredRoles = [];

      if (!slowModeIgnoredChannels.includes(message.channel.id) || !message.member.roles.some(role => slowModeIgnoredRoles.includes(role.id))) {
        if (!message.channel.permissionsFor(message.member) || !message.channel.permissionsFor(message.member).has('MANAGE_ROLES')) {
          if (guildModel && guildModel.dataValues.slowMode) {
            if (recentUsers.hasOwnProperty(message.author.id)) {
              let title, description;

              ++recentUsers[message.author.id];
              if (recentUsers[message.author.id] >= 8) {
                title = 'Warned ya!.';
                description = `${message.author} you have been muted for 15 minutes.`;
                await message.channel.overwritePermissions(message.author, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
                });

                setTimeout(() => {
                  let permissionOverwrites = message.channel.permissionOverwrites.get(message.author.id);
                  if (permissionOverwrites) {
                    if (permissionOverwrites.deny === 2112) {
                      permissionOverwrites.delete();
                    }
                    else {
                      message.channel.overwritePermissions(message.author, {
                        SEND_MESSAGES: null,
                        ADD_REACTIONS: null
                      }).catch(e => {
                        message.client.log.error(e);
                      });
                    }
                  }
                }, 15 * 60 * 1000);
              }
              else if (recentUsers[message.author.id] >= 6) {
                title = 'Cooldown, dark lord.';
                description = `${message.author} you are sending messages way too quickly.`;
              }
              else if (recentUsers[message.author.id] >= 4) {
                title = 'Woah There. Way too Spicy.';
                description = `${message.author} you are sending messages too quickly.`;
              }

              if (title && description) {
                await message.channel.send({
                  embed: {
                    color: message.client.colors.ORANGE,
                    title: title,
                    description: description
                  }
                });
              }
            }
            else {
              recentUsers[message.author.id] = 1;

              setTimeout(() => {
                delete recentUsers[message.author.id];
              }, 5 * 1000);
            }
          }
        }
      }

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
          if ([ 'idle', 'offline' ].includes(user.presence.status)) {
            message.channel.send(`**${user.tag}** is currently away from keyboard. ${user.username} will get back to you later.`).catch(() => {});
          }
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
