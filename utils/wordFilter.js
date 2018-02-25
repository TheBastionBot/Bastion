/**
 * @file wordFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of specific words in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    let query = `SELECT filterWord, filteredWords, wordFilterWhitelistChannels, wordFilterWhitelistRoles FROM guildSettings LEFT OUTER JOIN whitelists ON guildSettings.guildID = whitelists.guildID WHERE guildSettings.guildId='${message.guild.id}'`;
    let guild = await message.client.db.get(query);

    if (!guild.filterWord) return;
    // If the channel is whitelisted, return
    if (guild.wordFilterWhitelistChannels) {
      let whitelistChannels = guild.wordFilterWhitelistChannels.split(' ');
      if (whitelistChannels.includes(message.channel.id)) return;
    }
    // If the user is in a whitelisted role, return
    if (guild.wordFilterWhitelistRoles) {
      let whitelistRoles = guild.wordFilterWhitelistRoles.split(' ');
      for (let whitelistRole of whitelistRoles) {
        if (message.member.roles.has(whitelistRole)) return;
      }
    }
    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return;

    let filteredWords = [];
    if (guild.filteredWords) {
      filteredWords = guild.filteredWords.split(' ');
    }
    for (let word of filteredWords) {
      if (message.content.toLowerCase().split(' ').includes(word.toLowerCase())) {
        if (message.deletable) {
          message.delete().catch(() => {});
        }
        return true;
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
