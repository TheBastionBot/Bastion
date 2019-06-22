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
        attributes: [ 'guildID', 'filteredWords', 'moderationLog' ],
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
          // If the code reaches here, the message contains words that needs to be filtered
          resolve(true);

          if (message.deletable) message.delete().catch(() => {});

          message.channel.send({
            embed: {
              color: message.client.colors.ORANGE,
              description: `EXCUSE ME! ${message.author} you are not supposed to use that word in here!`
            }
          }).then(msg => {
            msg.delete(10000).catch(() => {});
          }).catch(() => {});


          // Log the words that are filtered
          if (!guildModel.dataValues.moderationLog) return;

          let modLogChannel = message.guild.channels.get(guildModel.dataValues.moderationLog);
          if (!modLogChannel) return;

          await modLogChannel.send({
            embed: {
              color: message.client.colors.ORANGE,
              title: 'Filtered Words',
              fields: [
                {
                  name: 'User',
                  value: message.author.tag,
                  inline: true
                },
                {
                  name: 'User ID',
                  value: message.author.id,
                  inline: true
                },
                {
                  name: 'Blocked Word',
                  value: word
                }
              ],
              timestamp: new Date()
            }
          });

          return resolve(true);
        }
      }
    }
    catch (e) {
      reject(e);
    }
  });
};
