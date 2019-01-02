/**
 * @file wordFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of specific words in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<boolean>} Whether or not the message, by an unauthorized
 * user, contains blacklisted words
 */
module.exports = message => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(false);

      // If the user has Manage Server permission, we don't need to filter it
      if (message.member.hasPermission('MANAGE_GUILD')) return;

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

      // Check if word filter is disabled
      if (!guildModel) return;

      // Check if the channel is whitelisted
      if (guildModel.textChannels.
        filter(channel => channel.dataValues.ignoreWordFilter).
        map(channel => channel.dataValues.channelID).
        includes(message.channel.id)) return;

      // Check if the user is in a whitelisted role
      let whitelistedRoles = guildModel.roles.
        filter(role => role.dataValues.ignoreWordFilter).
        map(role => role.dataValues.roleID);

      for (let role of whitelistedRoles) {
        if (message.member.roles.has(role)) return;
      }

      // If message contains a blacklisted word, filter it
      let filteredWords = guildModel.dataValues.filteredWords ? guildModel.dataValues.filteredWords : [];

      for (let word of filteredWords) {
        if (message.content.toLowerCase().split(' ').includes(word.toLowerCase())) {
          if (message.deletable) message.delete().catch(() => {});
          return resolve(true);
        }
      }
    }
    catch (e) {
      reject(e);
    }
  });
};
