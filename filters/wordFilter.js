/**
 * @file wordFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of specific words in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return;

    // Fetch filter data from database
    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'guildID', 'filteredWords' ],
      where: {
        guildID: message.guild.id,
        filterWords: true
      },
      include: [
        {
          model: message.client.database.models.textChannel,
          attributes: [ 'channelID', 'ignoreWordFilter' ]
        },
        {
          model: message.client.database.models.role,
          attributes: [ 'roleID', 'ignoreWordFilter' ]
        }
      ]
    });

    // If word filter is disabled, return
    if (!guildModel) return;

    // If the channel is whitelisted, return
    if (guildModel.textChannels.
      filter(channel => channel.dataValues.ignoreWordFilter).
      map(channel => channel.dataValues.channelID).
      includes(message.channel.id)) return;

    // If the user is in a whitelisted role, return
    let whitelistedRoles = guildModel.roles.
      filter(role => role.dataValues.ignoreWordFilter).
      map(role => role.dataValues.roleID);

    for (let role of whitelistedRoles) {
      if (message.member.roles.has(role)) return;
    }

    let filteredWords = guildModel.dataValues.filteredWords ? guildModel.dataValues.filteredWords : [];

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
