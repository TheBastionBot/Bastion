/**
 * @file emojiFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of messages considered as emoji spams.
 * @param {Message} message Discord.js message object
 * @returns {Promise<boolean>} Whether the message is an emoji spam
 */
module.exports = message => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(false);

      // We don't bother with messages that have no content.
      if (!message.content) return;

      // If the user has Manage Messages permission, we don't need to filter it.
      if (message.member.hasPermission('MANAGE_MESSAGES')) return;

      // Fetch filter data from database
      let guildModel = await message.client.database.models.guild.findOne({
        attributes: [ 'guildID' ],
        where: {
          guildID: message.guild.id,
          filterEmojis: true
        },
        include: [
          {
            model: message.client.database.models.textChannel,
            attributes: [ 'channelID', 'ignoreEmojiFilter' ]
          },
          {
            model: message.client.database.models.role,
            attributes: [ 'roleID', 'ignoreEmojiFilter' ]
          }
        ]
      });

      // Check if emoji filter is disabled
      if (!guildModel) return;

      // Check if the channel is whitelisted
      if (guildModel.textChannels.
        filter(channel => channel.dataValues.ignoreEmojiFilter).
        map(channel => channel.dataValues.channelID).
        includes(message.channel.id)) return;

      // Check if the user is in a whitelisted role
      let whitelistedRoles = guildModel.roles.
        filter(role => role.dataValues.ignoreEmojiFilter).
        map(role => role.dataValues.roleID);

      for (let role of whitelistedRoles) {
        if (message.member.roles.has(role)) return;
      }

      // NOTE: Don't blame me if this regex blows your mind when you read it.
      // Emojis are scattered like detritus all around the Unicode blocks. Maybe
      // because of history? But I don't know for sure.
      let nativeEmojisRegExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      let customEmojisRegExp = /<(?:a)?:[a-z0-9_-]{1,256}:[0-9]{16,19}>/gi;

      let nativeEmojis = message.content.match(nativeEmojisRegExp) || [];
      let customEmojis = message.content.match(customEmojisRegExp) || [];

      let emojis = nativeEmojis.concat(customEmojis);

      let cleanMessage = message.content.replace(nativeEmojisRegExp, '');
      cleanMessage = cleanMessage.replace(customEmojisRegExp, '');
      cleanMessage = cleanMessage.trim();

      // If more than 50% of a message's content are emojis, then it's
      // considered as emoji spam.
      let emojiPercentage = emojis.length / (cleanMessage.length + emojis.length) * 100;
      if (emojiPercentage > 50) resolve(true);
      else return resolve(false);

      if (message.deletable) await message.delete().catch(() => {});
    }
    catch (e) {
      reject(e);
    }
  });
};
