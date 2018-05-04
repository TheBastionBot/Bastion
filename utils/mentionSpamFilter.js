/**
 * @file mentionSpamFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of mention spams
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return;

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

    // If mention spam disabled, return
    if (!guildModel) return;

    if (message.mentions.users.size >= guildModel.dataValues.mentionSpamThreshold) {
      // If the code reaches here, the message is a mention spam.

      // Delete the message
      if (message.deletable) {
        message.delete().catch(() => {});
      }

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

      message.channel.send({
        embed: {
          color: message.client.colors.ORANGE,
          description: `Filtered a mention spam from ${message.author} with **${message.mentions.users.size}** mentions and ${action} him.`
        }
      }).catch(e => {
        message.client.log.error(e);
      });
      return true;
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
