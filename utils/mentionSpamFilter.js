/**
 * @file mentionSpamFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of mention spams
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    let guild = await message.client.db.get(`SELECT mentionSpamThreshold, mentionSpamAction FROM guildSettings WHERE guildId='${message.guild.id}'`), filtered = false;

    // If mention spam threshold is not set, return
    if (!guild.mentionSpamThreshold) return filtered;

    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return filtered;

    if (message.mentions.users.size >= guild.mentionSpamThreshold) {
      // If the code reaches here, the message is a mention spam.
      filtered = true;

      // Delete the message
      if (message.deletable) {
        message.delete().catch(() => {});
      }

      // Action on the user
      let action = 'did nothing with';
      if (guild.mentionSpamAction === 'kick' && message.member.kickable) {
        await message.member.kick('Mention Spam');
        action = 'kicked';
      }
      else if (guild.mentionSpamAction === 'ban' && message.member.bannable) {
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
    }

    return filtered;
  }
  catch (e) {
    message.client.log.error(e);
  }
};
