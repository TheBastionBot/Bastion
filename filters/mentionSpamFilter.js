/**
 * @file mentionSpamFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of mention spams
 * @param {Message} message Discord.js message object
 * @returns {Promise<boolean>} Whether or not the message is considered as a
 * mention spam.
 */
module.exports = message => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(false);

      // If the user has Manage Server permission, we don't need to filter it.
      if (message.member.hasPermission('MANAGE_GUILD')) return;

      // Fetch filter data from database
      let guildModel = await message.client.database.models.guild.findOne({
        attributes: [ 'guildID', 'mentionSpamThreshold', 'mentionSpamAction' ],
        where: {
          guildID: message.guild.id,
          filterMentions: true
        },
        include: [
          {
            model: message.client.database.models.textChannel,
            attributes: [ 'channelID', 'ignoreMentionFilter' ]
          },
          {
            model: message.client.database.models.role,
            attributes: [ 'roleID', 'ignoreMentionFilter' ]
          }
        ]
      });

      // Check if mention spam is disabled
      if (!guildModel) return;

      if (message.mentions.users.size >= guildModel.dataValues.mentionSpamThreshold) {
        // If the code reaches here, the message is a mention spam.
        resolve(true);

        // Delete the message
        if (message.deletable) message.delete().catch(() => {});

        // Action on the user
        let action = 'did nothing with';
        if (guildModel.dataValues.mentionSpamAction === 'kick' && message.member.kickable) {
          await message.member.kick('Mention Spam');
          action = 'kicked';
        }
        else if (guildModel.dataValues.mentionSpamAction === 'ban' && message.member.bannable) {
          await message.member.ban('Mention Spam');
          action = 'banned';
        }

        await message.channel.send({
          embed: {
            color: message.client.colors.ORANGE,
            description: `Filtered a mention spam from ${message.author} with **${message.mentions.users.size}** mentions and ${action} him.`
          }
        });
      }
    }
    catch (e) {
      reject(e);
    }
  });
};
